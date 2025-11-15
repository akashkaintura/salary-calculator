import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as mammoth from 'mammoth';
import { AtsUsage } from './entities/ats-usage.entity';
import { AtsCheck } from './entities/ats-check.entity';

// Import pdf-parse with proper type handling
const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;

export interface AtsCheckResult {
  score: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  keywordMatches: number;
  totalKeywords: number;
  fileSize: number;
  wordCount: number;
  companyComparisons: {
    goldmanSachs: { score: number; match: string };
    google: { score: number; match: string };
  };
  detailedAnalysis: {
    keywordDensity: number;
    sectionCompleteness: number;
    actionVerbUsage: number;
    quantifiableResults: number;
    technicalSkills: number;
  };
}

@Injectable()
export class AtsService {
  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly MAX_TRIES = 3;
  private readonly RESET_HOURS = 12;

  // Common ATS keywords to check
  private readonly ATS_KEYWORDS = [
    'skills', 'experience', 'education', 'certification', 'achievement',
    'leadership', 'project', 'team', 'communication', 'problem solving',
    'analytical', 'technical', 'professional', 'bachelor', 'master',
    'degree', 'certified', 'proficient', 'expert', 'knowledge',
    'responsibility', 'accomplishment', 'result', 'improve', 'increase',
    'develop', 'manage', 'implement', 'create', 'design', 'build',
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'database',
    'api', 'rest', 'git', 'agile', 'scrum', 'devops', 'cloud', 'aws',
  ];

  // Company-specific keywords
  private readonly GOLDMAN_SACHS_KEYWORDS = [
    'finance', 'financial', 'analytics', 'risk', 'trading', 'investment',
    'quantitative', 'modeling', 'derivatives', 'portfolio', 'compliance',
    'regulatory', 'excel', 'vba', 'sql', 'python', 'r', 'statistics',
    'mba', 'cfa', 'leadership', 'client', 'stakeholder', 'strategy',
  ];

  private readonly GOOGLE_KEYWORDS = [
    'algorithm', 'data structure', 'system design', 'distributed systems',
    'machine learning', 'ai', 'python', 'java', 'c++', 'go', 'javascript',
    'react', 'angular', 'kubernetes', 'docker', 'cloud', 'gcp', 'aws',
    'scalability', 'performance', 'optimization', 'open source', 'github',
    'leetcode', 'competitive programming', 'bachelor', 'master', 'phd',
  ];

  constructor(
    @InjectRepository(AtsUsage)
    private atsUsageRepository: Repository<AtsUsage>,
    @InjectRepository(AtsCheck)
    private atsCheckRepository: Repository<AtsCheck>,
  ) {}

  async checkUsageLimit(userId: string): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const resetTime = new Date();
    resetTime.setHours(resetTime.getHours() - this.RESET_HOURS);

    // Count usage in last 12 hours
    const recentUsage = await this.atsUsageRepository.count({
      where: {
        userId,
        createdAt: MoreThan(resetTime),
      },
    });

    const remaining = Math.max(0, this.MAX_TRIES - recentUsage);
    const allowed = remaining > 0;

    // Calculate next reset time
    const resetAt = new Date();
    if (recentUsage > 0) {
      const oldestUsage = await this.atsUsageRepository.findOne({
        where: { userId },
        order: { createdAt: 'ASC' },
      });
      if (oldestUsage) {
        resetAt.setTime(oldestUsage.createdAt.getTime() + this.RESET_HOURS * 60 * 60 * 1000);
      }
    }

    return { allowed, remaining, resetAt };
  }

  async recordUsage(userId: string): Promise<void> {
    const usage = this.atsUsageRepository.create({ userId });
    await this.atsUsageRepository.save(usage);
  }

  async parseFile(file: Express.Multer.File): Promise<string> {
    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds 2MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF and DOCX files are allowed');
    }

    try {
      if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        return data.text;
      } else if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result.value;
      }
    } catch (error) {
      throw new BadRequestException('Failed to parse file. Please ensure it is a valid PDF or DOCX file.');
    }
  }

  async checkAts(resumeText: string): Promise<AtsCheckResult> {
    const lowerText = resumeText.toLowerCase();
    const words = resumeText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Count keyword matches
    const matchedKeywords = this.ATS_KEYWORDS.filter(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );
    const keywordMatches = matchedKeywords.length;
    const totalKeywords = this.ATS_KEYWORDS.length;

    // Company-specific keyword matching
    const goldmanMatches = this.GOLDMAN_SACHS_KEYWORDS.filter(keyword =>
      lowerText.includes(keyword.toLowerCase())
    ).length;
    const googleMatches = this.GOOGLE_KEYWORDS.filter(keyword =>
      lowerText.includes(keyword.toLowerCase())
    ).length;

    // Calculate company-specific scores
    const goldmanScore = Math.round((goldmanMatches / this.GOLDMAN_SACHS_KEYWORDS.length) * 100);
    const googleScore = Math.round((googleMatches / this.GOOGLE_KEYWORDS.length) * 100);

    // Determine match level
    const getMatchLevel = (score: number): string => {
      if (score >= 70) return 'Excellent Match';
      if (score >= 50) return 'Good Match';
      if (score >= 30) return 'Fair Match';
      return 'Needs Improvement';
    };

    // Detailed analysis metrics
    const keywordDensity = Math.round((keywordMatches / wordCount) * 1000 * 100) / 100; // per 1000 words
    
    // Section completeness (0-100)
    const sections = {
      contact: /email|phone|contact|address/i.test(resumeText),
      experience: /experience|work|employment|position/i.test(resumeText),
      education: /education|degree|university|college|bachelor|master/i.test(resumeText),
      skills: /skills|technical|proficient|expert/i.test(resumeText),
    };
    const sectionCompleteness = Math.round(
      (Object.values(sections).filter(Boolean).length / Object.keys(sections).length) * 100
    );

    // Action verb usage
    const actionVerbs = ['achieved', 'improved', 'developed', 'managed', 'implemented', 'created', 'designed', 'built', 'led', 'increased', 'optimized', 'delivered', 'executed', 'launched'];
    const foundActionVerbs = actionVerbs.filter(verb => lowerText.includes(verb));
    const actionVerbUsage = Math.min(Math.round((foundActionVerbs.length / actionVerbs.length) * 100), 100);

    // Quantifiable results (numbers, percentages, metrics)
    const quantifiablePattern = /\d+%|\d+\s*(million|billion|thousand|k|m|b)|increased by|decreased by|reduced by|improved by/i;
    const hasQuantifiableResults = quantifiablePattern.test(resumeText);
    const quantifiableResults = hasQuantifiableResults ? 100 : 0;

    // Technical skills detection
    const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'database', 'api', 'git', 'docker', 'kubernetes', 'aws', 'cloud'];
    const foundTechSkills = techKeywords.filter(keyword => lowerText.includes(keyword));
    const technicalSkills = Math.min(Math.round((foundTechSkills.length / techKeywords.length) * 100), 100);

    // Calculate overall score (0-100)
    const keywordScore = (keywordMatches / totalKeywords) * 40; // 40% weight
    const lengthScore = Math.min(wordCount / 500, 1) * 20; // 20% weight
    const sectionScore = (sectionCompleteness / 100) * 20; // 20% weight
    const actionVerbScore = (actionVerbUsage / 100) * 10; // 10% weight
    const quantifiableScore = (quantifiableResults / 100) * 10; // 10% weight
    const score = Math.round(keywordScore + lengthScore + sectionScore + actionVerbScore + quantifiableScore);

    // Generate suggestions
    const suggestions: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (keywordMatches < totalKeywords * 0.3) {
      weaknesses.push('Low keyword density - add more relevant skills and keywords');
      suggestions.push('Include more industry-specific keywords and technical skills');
    } else {
      strengths.push('Good keyword coverage');
    }

    if (wordCount < 300) {
      weaknesses.push('Resume is too short - may lack detail');
      suggestions.push('Expand on your experience and achievements');
    } else if (wordCount > 1000) {
      weaknesses.push('Resume is too long - ATS systems prefer concise resumes');
      suggestions.push('Condense your resume to 1-2 pages');
    } else {
      strengths.push('Appropriate resume length');
    }

    if (!sections.contact) {
      weaknesses.push('Missing contact information');
      suggestions.push('Add email and phone number');
    } else {
      strengths.push('Contact information present');
    }

    if (!sections.experience) {
      weaknesses.push('Missing work experience section');
      suggestions.push('Add a detailed work experience section');
    } else {
      strengths.push('Work experience section present');
    }

    if (!sections.education) {
      weaknesses.push('Missing education section');
      suggestions.push('Add your educational background');
    } else {
      strengths.push('Education section present');
    }

    if (!sections.skills) {
      weaknesses.push('Missing skills section');
      suggestions.push('Add a dedicated skills section');
    } else {
      strengths.push('Skills section present');
    }

    if (foundActionVerbs.length === 0) {
      weaknesses.push('No action verbs found');
      suggestions.push('Use action verbs to describe achievements (e.g., achieved, improved, developed)');
    } else if (foundActionVerbs.length < 3) {
      suggestions.push('Use more action verbs to strengthen your achievements');
    } else {
      strengths.push(`Good use of action verbs (${foundActionVerbs.length} found)`);
    }

    if (!hasQuantifiableResults) {
      weaknesses.push('Missing quantifiable results');
      suggestions.push('Add numbers, percentages, and metrics to show impact (e.g., "increased revenue by 30%")');
    } else {
      strengths.push('Quantifiable results present');
    }

    if (technicalSkills < 30) {
      suggestions.push('Add more technical skills relevant to your field');
    } else {
      strengths.push(`Strong technical skills coverage (${foundTechSkills.length} skills found)`);
    }

    // Company-specific suggestions
    if (goldmanScore < 50) {
      suggestions.push('For Goldman Sachs: Add finance, analytics, risk management, and quantitative skills');
    }
    if (googleScore < 50) {
      suggestions.push('For Google: Emphasize algorithms, system design, distributed systems, and technical depth');
    }

    return {
      score,
      suggestions,
      strengths,
      weaknesses,
      keywordMatches,
      totalKeywords,
      fileSize: 0, // Will be set by controller
      wordCount,
      companyComparisons: {
        goldmanSachs: {
          score: goldmanScore,
          match: getMatchLevel(goldmanScore),
        },
        google: {
          score: googleScore,
          match: getMatchLevel(googleScore),
        },
      },
      detailedAnalysis: {
        keywordDensity,
        sectionCompleteness,
        actionVerbUsage,
        quantifiableResults,
        technicalSkills,
      },
    };
  }

  async saveCheckResult(userId: string, result: AtsCheckResult): Promise<AtsCheck> {
    const check = this.atsCheckRepository.create({
      userId,
      score: result.score,
      keywordMatches: result.keywordMatches,
      totalKeywords: result.totalKeywords,
      wordCount: result.wordCount,
      fileSize: result.fileSize,
      suggestions: result.suggestions,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      companyComparisons: result.companyComparisons,
      detailedAnalysis: result.detailedAnalysis,
    });
    return await this.atsCheckRepository.save(check);
  }

  async getUserChecks(userId: string): Promise<AtsCheck[]> {
    return this.atsCheckRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50, // Limit to last 50 checks
    });
  }

  async getCheckById(id: string, userId: string): Promise<AtsCheck> {
    const check = await this.atsCheckRepository.findOne({
      where: { id, userId },
    });
    if (!check) {
      throw new NotFoundException('Check not found');
    }
    return check;
  }
}


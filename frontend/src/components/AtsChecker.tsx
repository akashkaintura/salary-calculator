import { FileText, CheckCircle, Construction } from 'lucide-react';
import './AtsChecker.css';

const getApiBaseUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const API_BASE_URL = getApiBaseUrl();

interface AtsResult {
    score: number;
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
    keywordMatches: number;
    totalKeywords: number;
    fileSize: number;
    wordCount: number;
    remaining: number;
    resetAt: string;
    checkId?: string;
    companyComparisons?: {
        goldmanSachs: { score: number; match: string };
        google: { score: number; match: string };
        allCompanies?: Record<string, { score: number; match: string }>;
    };
    detailedAnalysis?: {
        keywordDensity: number;
        sectionCompleteness: number;
        actionVerbUsage: number;
        quantifiableResults: number;
        technicalSkills: number;
    };
    premiumFeatures?: {
        optimizedKeywords: string[];
        industrySpecificSuggestions: string[];
        resumeOptimizationTips: string[];
        missingKeywords: string[];
        keywordReplacements: Array<{ current: string; suggested: string; reason: string }>;
    };
}

interface AtsHistoryItem {
    id: string;
    score: number;
    wordCount: number;
    keywordMatches: number;
    createdAt: string;
    companyComparisons?: {
        goldmanSachs: { score: number; match: string };
        google: { score: number; match: string };
    };
}

export default function AtsChecker() {
    const { token, logout } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<AtsResult | null>(null);
    const [usage, setUsage] = useState<{ remaining: number; resetAt: string } | null>(null);
    const [history, setHistory] = useState<AtsHistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loadingPremium, setLoadingPremium] = useState(false);
    const [currentCheckId, setCurrentCheckId] = useState<string | null>(null);
    const [showUPIPayment, setShowUPIPayment] = useState(false);
    const [paymentOrder, setPaymentOrder] = useState<{
        orderId: string;
        amount: number;
        upiId: string;
        merchantName: string;
    } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Only PDF and DOCX files are allowed');
                setFile(null);
                return;
            }

            // Validate file size (2MB)
            if (selectedFile.size > 2 * 1024 * 1024) {
                setError('File size must be less than 2MB');
                setFile(null);
                return;
            }

            setFile(selectedFile);
            setError('');
            setResult(null);
        }
    };

    const checkUsage = async () => {
        if (!token) return;

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/ats/usage`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUsage(response.data);
        } catch (err: any) {
            if (err.response?.status === 401) {
                logout();
            }
            console.error('Failed to fetch usage:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        if (!token) {
            setError('Please log in to check your resume');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post<AtsResult>(
                `${API_BASE_URL}/api/ats/check`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Don't set Content-Type - let axios set it with the correct boundary
                    },
                }
            );

            setResult(response.data);
            setUsage({ remaining: response.data.remaining, resetAt: response.data.resetAt });
            // Store check ID from response if available, or get from history
            if (response.data.checkId) {
                setCurrentCheckId(response.data.checkId);
            }
            loadHistory(); // Refresh history after new check
            // Get check ID from the latest history item after loading if not in response
            if (!response.data.checkId) {
                setTimeout(() => {
                    if (history.length > 0) {
                        setCurrentCheckId(history[0].id);
                    }
                }, 500);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                logout();
            } else if (err.response?.status === 403) {
                setError(err.response.data.message || 'You have reached the limit of 3 checks');
            } else if (err.response?.status === 400) {
                setError(err.response.data.message || 'Invalid file. Please check the file format and size.');
            } else {
                setError(err.response?.data?.message || 'Failed to check resume. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadHistory = async () => {
        if (!token) return;

        try {
            const response = await axios.get<AtsHistoryItem[]>(
                `${API_BASE_URL}/api/ats/history`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setHistory(response.data);
            // Set current check ID from latest history item
            if (response.data.length > 0 && !currentCheckId) {
                setCurrentCheckId(response.data[0].id);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                logout();
            }
            console.error('Failed to load history:', err);
        }
    };

    // Load usage and history on mount
    useEffect(() => {
        if (token) {
            checkUsage();
            loadHistory();
        }
    }, [token]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981'; // green
        if (score >= 60) return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const handlePremiumUpgrade = async () => {
        if (!currentCheckId) {
            setError('Unable to process premium upgrade. Please check your resume again.');
            return;
        }

        setLoadingPremium(true);
        setError('');

        try {
            // Create UPI payment order
            const orderResponse = await axios.post(
                `${API_BASE_URL}/api/payment/create-upi-order`,
                { checkId: currentCheckId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setPaymentOrder({
                orderId: orderResponse.data.orderId,
                amount: orderResponse.data.amount,
                upiId: orderResponse.data.upiId,
                merchantName: orderResponse.data.merchantName,
            });

            setShowUPIPayment(true);
            setLoadingPremium(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initiate payment');
            setLoadingPremium(false);
        }
    };

    const handlePaymentSuccess = async () => {
        if (!paymentOrder || !currentCheckId) {
            return;
        }

        try {
            // Confirm payment
            await axios.post(
                `${API_BASE_URL}/api/payment/confirm-payment`,
                { orderId: paymentOrder.orderId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Get premium enhancements (resumeText is optional, backend will use stored text)
            const enhanceResponse = await axios.post(
                `${API_BASE_URL}/api/ats/premium/enhance`,
                {
                    checkId: currentCheckId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setResult(enhanceResponse.data);
            setShowUPIPayment(false);
            setPaymentOrder(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to activate premium features');
        }
    };

    // Show "Coming Soon" message
    return (
        <div className="ats-checker">
            <div className="ats-header">
                <FileText size={24} />
                <div>
                    <h2>Resume ATS Checker</h2>
                    <p>Get your resume analyzed for ATS compatibility</p>
                </div>
            </div>
            
            <div className="coming-soon-container">
                <Construction size={64} className="coming-soon-icon" />
                <h3>Coming Soon!</h3>
                <p>We're working hard to bring you an amazing ATS checker feature.</p>
                <p className="coming-soon-subtitle">This feature will help you optimize your resume for Applicant Tracking Systems and improve your chances of getting noticed by recruiters.</p>
                <div className="coming-soon-features">
                    <div className="feature-item">
                        <CheckCircle size={20} />
                        <span>PDF & DOCX Resume Analysis</span>
                    </div>
                    <div className="feature-item">
                        <CheckCircle size={20} />
                        <span>ATS Score Calculation</span>
                    </div>
                    <div className="feature-item">
                        <CheckCircle size={20} />
                        <span>Company-Specific Keyword Matching</span>
                    </div>
                    <div className="feature-item">
                        <CheckCircle size={20} />
                        <span>Detailed Improvement Suggestions</span>
                    </div>
                    <div className="feature-item">
                        <CheckCircle size={20} />
                        <span>Premium Enhancements</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


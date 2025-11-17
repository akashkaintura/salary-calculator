import { useState } from 'react';
import { FileText, Merge, Split, Minimize2, FileDown, FileUp, Edit, Image, PenTool, Stamp, RotateCw, Construction, X } from 'lucide-react';
import './DocumentConverter.css';

interface Tool {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const tools: Tool[] = [
    {
        id: 'merge-pdf',
        title: 'Merge PDF',
        description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
        icon: <Merge size={32} />,
        color: '#f97316',
    },
    {
        id: 'split-pdf',
        title: 'Split PDF',
        description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
        icon: <Split size={32} />,
        color: '#f97316',
    },
    {
        id: 'compress-pdf',
        title: 'Compress PDF',
        description: 'Reduce file size while optimizing for maximal PDF quality.',
        icon: <Minimize2 size={32} />,
        color: '#10b981',
    },
    {
        id: 'pdf-to-word',
        title: 'PDF to Word',
        description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.',
        icon: <FileDown size={32} />,
        color: '#3b82f6',
    },
    {
        id: 'pdf-to-powerpoint',
        title: 'PDF to PowerPoint',
        description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
        icon: <FileDown size={32} />,
        color: '#f97316',
    },
    {
        id: 'pdf-to-excel',
        title: 'PDF to Excel',
        description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
        icon: <FileDown size={32} />,
        color: '#10b981',
    },
    {
        id: 'word-to-pdf',
        title: 'Word to PDF',
        description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
        icon: <FileUp size={32} />,
        color: '#3b82f6',
    },
    {
        id: 'powerpoint-to-pdf',
        title: 'PowerPoint to PDF',
        description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
        icon: <FileUp size={32} />,
        color: '#f97316',
    },
    {
        id: 'excel-to-pdf',
        title: 'Excel to PDF',
        description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
        icon: <FileUp size={32} />,
        color: '#10b981',
    },
    {
        id: 'edit-pdf',
        title: 'Edit PDF',
        description: 'Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.',
        icon: <Edit size={32} />,
        color: '#8b5cf6',
    },
    {
        id: 'pdf-to-jpg',
        title: 'PDF to JPG',
        description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
        icon: <Image size={32} />,
        color: '#fbbf24',
    },
    {
        id: 'jpg-to-pdf',
        title: 'JPG to PDF',
        description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
        icon: <Image size={32} />,
        color: '#fbbf24',
    },
    {
        id: 'sign-pdf',
        title: 'Sign PDF',
        description: 'Sign yourself or request electronic signatures from others.',
        icon: <PenTool size={32} />,
        color: '#3b82f6',
    },
    {
        id: 'watermark',
        title: 'Watermark',
        description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
        icon: <Stamp size={32} />,
        color: '#8b5cf6',
    },
    {
        id: 'rotate-pdf',
        title: 'Rotate PDF',
        description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
        icon: <RotateCw size={32} />,
        color: '#8b5cf6',
    },
];

export default function DocumentConverter() {
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    const handleToolClick = (toolId: string, toolTitle: string) => {
        setSelectedTool(toolTitle);
        setShowComingSoon(true);
    };

    return (
        <div className="document-converter">
            <div className="converter-header">
                <FileText size={24} />
                <div>
                    <h2>Document Converter</h2>
                    <p>Convert, merge, split, and edit your documents with ease</p>
                </div>
            </div>

            <div className="tools-grid">
                {tools.map((tool) => (
                    <div 
                        key={tool.id} 
                        className="tool-card"
                        onClick={() => handleToolClick(tool.id, tool.title)}
                    >
                        <div className="tool-icon" style={{ color: tool.color }}>
                            {tool.icon}
                        </div>
                        <h3>{tool.title}</h3>
                        <p>{tool.description}</p>
                        <div className="tool-status">
                            <Construction size={16} />
                            <span>Under Progress</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Coming Soon Modal */}
            {showComingSoon && (
                <div className="coming-soon-overlay" onClick={() => setShowComingSoon(false)}>
                    <div className="coming-soon-modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="coming-soon-close"
                            onClick={() => setShowComingSoon(false)}
                        >
                            <X size={24} />
                        </button>
                        <div className="coming-soon-content">
                            <Construction size={64} className="coming-soon-icon" />
                            <h2>Coming Soon!</h2>
                            <p className="coming-soon-tool">{selectedTool}</p>
                            <p className="coming-soon-message">
                                We're working hard to bring you this feature. 
                                It will be available soon!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


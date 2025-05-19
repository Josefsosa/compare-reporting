import React, { useState } from 'react';

const TechnologyComparisonTool = () => {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [inputTypeA, setInputTypeA] = useState('file');
  const [inputTypeB, setInputTypeB] = useState('file');
  const [comparisonResults, setComparisonResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  
  const criteriaCategories = [
    {
      name: "Scientific Impact",
      criteria: [
        { id: "novelty", name: "Scientific Novelty", descriptionA: "Highly novel quantum-enhanced graph structures", descriptionB: "Incremental improvements to existing neural architectures", scoreA: 92, scoreB: 68 },
        { id: "advancement", name: "Field Advancement", descriptionA: "Potential paradigm shift in AI reasoning capabilities", descriptionB: "Significant but expected progress along established research lines", scoreA: 88, scoreB: 72 },
        { id: "foundation", name: "Foundational Science", descriptionA: "New theoretical framework for AI consciousness", descriptionB: "Enhanced mathematical model for existing approaches", scoreA: 95, scoreB: 64 },
        { id: "verification", name: "Empirical Verification", descriptionA: "Strong theoretical basis with early empirical validation", descriptionB: "Extensive empirical results on established benchmarks", scoreA: 78, scoreB: 86 }
      ]
    },
    {
      name: "Business Value",
      criteria: [
        { id: "roi", name: "Return on Investment", descriptionA: "High potential return but longer time horizon (3-5 years)", descriptionB: "Moderate but immediate returns (6-18 months)", scoreA: 76, scoreB: 89 },
        { id: "competitive", name: "Competitive Advantage", descriptionA: "Potentially disruptive with 2-3 year market exclusivity", descriptionB: "Incremental advantage with immediate market differentiation", scoreA: 94, scoreB: 71 },
        { id: "operational", name: "Operational Efficiency", descriptionA: "Transformative efficiency gains requiring significant process changes", descriptionB: "Moderate efficiency improvements with minimal process disruption", scoreA: 82, scoreB: 87 },
        { id: "marketability", name: "Commercial Marketability", descriptionA: "Challenging to communicate value proposition to mainstream market", descriptionB: "Readily understandable value proposition with established market demand", scoreA: 65, scoreB: 92 },
        { id: "implementation", name: "Implementation Cost", descriptionA: "High initial investment with significant integration requirements", descriptionB: "Moderate investment with straightforward integration path", scoreA: 58, scoreB: 86 },
        { id: "scalability", name: "Business Scalability", descriptionA: "Exponential value scaling once threshold adoption is achieved", descriptionB: "Linear value scaling with predictable growth model", scoreA: 91, scoreB: 74 }
      ]
    },
    {
      name: "Humanitarian Value",
      criteria: [
        { id: "accessibility", name: "Global Accessibility", descriptionA: "Requires specialized quantum hardware limited to developed nations", descriptionB: "Can run on widely available computational resources", scoreA: 45, scoreB: 92 },
        { id: "equity", name: "Equitable Benefits", descriptionA: "Potential for broad societal benefits but initial access barriers", descriptionB: "Immediate benefits with more equitable distribution", scoreA: 62, scoreB: 84 },
        { id: "problems", name: "Critical Problem Solving", descriptionA: "Could address previously unsolvable complex systems challenges", descriptionB: "Incremental improvements to existing problem-solving capabilities", scoreA: 96, scoreB: 70 },
        { id: "risk", name: "Safety & Risk Mitigation", descriptionA: "Novel architectural safeguards against emergent risks", descriptionB: "Well-understood risk profile with established mitigations", scoreA: 87, scoreB: 81 }
      ]
    },
    {
      name: "Technical Viability",
      criteria: [
        { id: "feasibility", name: "Implementation Feasibility", descriptionA: "Challenging implementation requiring significant new infrastructure", descriptionB: "Readily implementable with existing technology stack", scoreA: 54, scoreB: 94 },
        { id: "tech-scalability", name: "Technical Scalability", descriptionA: "Theoretical scalability advantages but unproven at scale", descriptionB: "Demonstrated scalability with predictable resource requirements", scoreA: 72, scoreB: 88 },
        { id: "integration", name: "Ecosystem Integration", descriptionA: "Requires fundamental shifts in integration approaches", descriptionB: "Compatible with existing AI/ML ecosystems", scoreA: 58, scoreB: 96 },
        { id: "validation", name: "Validation Methodology", descriptionA: "Novel validation approaches with strong theoretical basis", descriptionB: "Well-established validation methodology with broad acceptance", scoreA: 82, scoreB: 90 }
      ]
    }
  ];
  
  const calculateCategoryScores = () => {
    const categoryScores = criteriaCategories.map(category => {
      const totalA = category.criteria.reduce((sum, criterion) => sum + criterion.scoreA, 0);
      const totalB = category.criteria.reduce((sum, criterion) => sum + criterion.scoreB, 0);
      const count = category.criteria.length;
      
      return {
        name: category.name,
        averageA: Math.round(totalA / count),
        averageB: Math.round(totalB / count)
      };
    });
    
    return categoryScores;
  };
  
  const calculateOverallScores = () => {
    let totalScoreA = 0;
    let totalScoreB = 0;
    let totalCriteria = 0;
    
    criteriaCategories.forEach(category => {
      category.criteria.forEach(criterion => {
        totalScoreA += criterion.scoreA;
        totalScoreB += criterion.scoreB;
        totalCriteria++;
      });
    });
    
    return {
      averageA: Math.round(totalScoreA / totalCriteria),
      averageB: Math.round(totalScoreB / totalCriteria)
    };
  };
  
  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };
  
  const handleCompare = () => {
    // In a real implementation, this would process the files/URLs
    // and generate actual analysis results
    setIsAnalyzing(true);
    
    // Simulate analysis time
    setTimeout(() => {
      setComparisonResults({
        overallScores: calculateOverallScores(),
        categoryScores: calculateCategoryScores(),
        categories: criteriaCategories,
        businessRecommendations: [
          "Technology A offers significant long-term competitive advantage and market disruption potential",
          "Technology B provides faster time-to-market and immediate ROI on existing infrastructure",
          "For organizations with strong financial positions, Technology A represents a strategic investment in future market leadership",
          "For organizations requiring immediate returns, Technology B offers a safer path with predictable outcomes",
          "Consider a phased approach: implement Technology B for immediate gains while investing in Technology A R&D"
        ],
        scientificRecommendations: [
          "Technology A shows exceptional promise for advancing fundamental AI science with breakthrough approaches",
          "Technology B offers reliable advancement along established scientific directions",
          "Consider collaborative research combining A's theoretical innovations with B's empirical validation methods",
          "Prioritize additional research to validate A's theoretical advantages in practical applications"
        ],
        humanitarianRecommendations: [
          "Technology B can address immediate humanitarian needs with wider accessibility",
          "Technology A has potential for solving previously intractable humanitarian challenges in the longer term",
          "Develop transition strategies to make Technology A's benefits more widely accessible over time",
          "Establish partnerships to mitigate implementation barriers for Technology A in developing regions"
        ],
        conclusionA: "Revolutionary potential with significant market disruption and scientific advancement, requiring substantial investment and longer time horizon",
        conclusionB: "Evolutionary advancement with immediate practical benefits, faster ROI, and broader accessibility"
      });
      setIsAnalyzing(false);
    }, 2000);
  };
  
  // Rating label and color based on score
  const getRatingProps = (score) => {
    if (score >= 90) return { label: "Exceptional", color: "#22c55e" };
    if (score >= 80) return { label: "Excellent", color: "#84cc16" };
    if (score >= 70) return { label: "Very Good", color: "#3b82f6" };
    if (score >= 60) return { label: "Good", color: "#6366f1" };
    if (score >= 50) return { label: "Average", color: "#f59e0b" };
    return { label: "Below Average", color: "#ef4444" };
  };

  // Component for score display
  const ScoreDisplay = ({ score, size = "normal" }) => {
    const { label, color } = getRatingProps(score);
    
    return (
      <div className={`flex flex-col items-center ${size === "large" ? "gap-2" : "gap-1"}`}>
        <div 
          className={`
            ${size === "large" ? "w-28 h-28" : "w-16 h-16"} 
            rounded-full flex items-center justify-center 
            border-4
          `}
          style={{ borderColor: color }}
        >
          <span className={`${size === "large" ? "text-3xl" : "text-xl"} font-bold`} style={{ color: color }}>
            {score}
          </span>
        </div>
        <span className={`${size === "large" ? "text-sm" : "text-xs"} text-gray-600 dark:text-gray-300`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Technology Impact Comparison Tool</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Upload two architecture diagrams or provide links to PDF articles to compare their potential benefits for scientific advancement, business value, and humanitarian impact.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Technology A */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Technology A</h2>
            
            <div className="mb-4">
              <div className="flex gap-4 mb-4">
                <button 
                  className={`px-4 py-2 rounded ${inputTypeA === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  onClick={() => setInputTypeA('file')}
                >
                  Upload File
                </button>
                <button 
                  className={`px-4 py-2 rounded ${inputTypeA === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  onClick={() => setInputTypeA('url')}
                >
                  Provide URL
                </button>
              </div>
              
              {inputTypeA === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, setFileA)}
                    className="hidden"
                    id="fileA"
                    accept=".pdf,.png,.jpg,.jpeg,.svg"
                  />
                  <label htmlFor="fileA" className="cursor-pointer">
                    <div className="text-4xl mb-2">⬆️</div>
                    <p className="mb-2 font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PDF, PNG, JPG, or SVG</p>
                    {fileA && (
                      <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                        <p className="text-sm">{fileA.name}</p>
                      </div>
                    )}
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block mb-2 text-sm font-medium">PDF or Article URL</label>
                  <input
                    type="url"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    placeholder="https://example.com/technology-a.pdf"
                    value={urlA}
                    onChange={(e) => setUrlA(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            {comparisonResults && (
              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <h3 className="text-lg font-semibold mb-2">Summary Analysis</h3>
                <ScoreDisplay score={comparisonResults.overallScores.averageA} size="large" />
                <p className="mt-4 text-sm">{comparisonResults.conclusionA}</p>
              </div>
            )}
          </div>
          
          {/* Right Column - Technology B */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">Technology B</h2>
            
            <div className="mb-4">
              <div className="flex gap-4 mb-4">
                <button 
                  className={`px-4 py-2 rounded ${inputTypeB === 'file' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  onClick={() => setInputTypeB('file')}
                >
                  Upload File
                </button>
                <button 
                  className={`px-4 py-2 rounded ${inputTypeB === 'url' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  onClick={() => setInputTypeB('url')}
                >
                  Provide URL
                </button>
              </div>
              
              {inputTypeB === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, setFileB)}
                    className="hidden"
                    id="fileB"
                    accept=".pdf,.png,.jpg,.jpeg,.svg"
                  />
                  <label htmlFor="fileB" className="cursor-pointer">
                    <div className="text-4xl mb-2">⬆️</div>
                    <p className="mb-2 font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PDF, PNG, JPG, or SVG</p>
                    {fileB && (
                      <div className="mt-4 p-2 bg-purple-50 dark:bg-purple-900 rounded">
                        <p className="text-sm">{fileB.name}</p>
                      </div>
                    )}
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block mb-2 text-sm font-medium">PDF or Article URL</label>
                  <input
                    type="url"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    placeholder="https://example.com/technology-b.pdf"
                    value={urlB}
                    onChange={(e) => setUrlB(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            {comparisonResults && (
              <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                <h3 className="text-lg font-semibold mb-2">Summary Analysis</h3>
                <ScoreDisplay score={comparisonResults.overallScores.averageB} size="large" />
                <p className="mt-4 text-sm">{comparisonResults.conclusionB}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Button */}
        <div className="flex justify-center mb-8">
          <button
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 text-lg"
            onClick={handleCompare}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>Compare Technologies</>
            )}
          </button>
        </div>
        
        {/* Results Section */}
        {comparisonResults && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Comparison Results</h2>
            
            {/* Category Score Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Category Overview</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {comparisonResults.categoryScores.map((category, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-center">{category.name}</h4>
                    <div className="flex justify-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{category.averageA}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tech A</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{category.averageB}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tech B</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Detailed Comparison */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Detailed Analysis</h3>
                <button
                  className="text-blue-600 dark:text-blue-400 text-sm"
                  onClick={() => setShowFullReport(!showFullReport)}
                >
                  {showFullReport ? "Show Summary" : "Show Full Report"}
                </button>
              </div>
              
              {comparisonResults.categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  <h4 className="font-medium mb-4 pb-2 border-b dark:border-gray-700">
                    {category.name}
                  </h4>
                  
                  {(showFullReport ? category.criteria : category.criteria.slice(0, 3)).map((criterion, criterionIndex) => (
                    <div key={criterionIndex} className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{criterion.name}</div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            <span>{criterion.scoreA}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            <span>{criterion.scoreB}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        <div className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">Technology A:</span> {criterion.descriptionA}
                        </div>
                        <div className="text-sm bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                          <span className="text-purple-600 dark:text-purple-400 font-medium">Technology B:</span> {criterion.descriptionB}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!showFullReport && category.criteria.length > 3 && (
                    <button
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => setShowFullReport(true)}
                    >
                      + {category.criteria.length - 3} more criteria in this category
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Recommendations */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Strategic Recommendations</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 pb-2 border-b border-blue-200 dark:border-blue-800">
                    Business Perspective
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {comparisonResults.businessRecommendations.map((rec, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3 pb-2 border-b border-purple-200 dark:border-purple-800">
                    Scientific Perspective
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {comparisonResults.scientificRecommendations.map((rec, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-3 pb-2 border-b border-green-200 dark:border-green-800">
                    Humanitarian Perspective
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {comparisonResults.humanitarianRecommendations.map((rec, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-green-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Final Comparison */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">Final Assessment</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="mb-4">
                    <ScoreDisplay score={comparisonResults.overallScores.averageA} size="large" />
                  </div>
                  <h4 className="font-medium text-lg text-blue-700 dark:text-blue-300 mb-2">Technology A</h4>
                  <p className="text-sm">{comparisonResults.conclusionA}</p>
                </div>
                
                <div className="text-center">
                  <div className="mb-4">
                    <ScoreDisplay score={comparisonResults.overallScores.averageB} size="large" />
                  </div>
                  <h4 className="font-medium text-lg text-purple-700 dark:text-purple-300 mb-2">Technology B</h4>
                  <p className="text-sm">{comparisonResults.conclusionB}</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <p className="text-center font-medium">
                  Both technologies offer unique advantages for different strategic priorities.
                  Consider your organization's specific goals, timeline, and resource constraints when making a final decision.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnologyComparisonTool;

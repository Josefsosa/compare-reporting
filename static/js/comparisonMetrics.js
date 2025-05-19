/**
 * Comparison Metrics class
 * Responsible for generating comparison data between documents
 */
class ComparisonMetrics {
    constructor() {
        // Defining criteria categories based on provided dataset
        this.criteriaCategories = [
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
    }
    
    /**
     * Calculate average scores for each category
     * @returns {Array} - Category scores
     */
    calculateCategoryScores() {
        return this.criteriaCategories.map(category => {
            const totalA = category.criteria.reduce((sum, criterion) => sum + criterion.scoreA, 0);
            const totalB = category.criteria.reduce((sum, criterion) => sum + criterion.scoreB, 0);
            const count = category.criteria.length;
            
            return {
                name: category.name,
                averageA: Math.round(totalA / count),
                averageB: Math.round(totalB / count)
            };
        });
    }
    
    /**
     * Calculate overall scores across all criteria
     * @returns {Object} - Overall scores
     */
    calculateOverallScores() {
        let totalScoreA = 0;
        let totalScoreB = 0;
        let totalCriteria = 0;
        
        this.criteriaCategories.forEach(category => {
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
    }
    
    /**
     * Generate a full comparison report
     * @returns {Object} - Complete comparison results
     */
    generateComparison() {
        return {
            overallScores: this.calculateOverallScores(),
            categoryScores: this.calculateCategoryScores(),
            categories: this.criteriaCategories,
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
        };
    }
}

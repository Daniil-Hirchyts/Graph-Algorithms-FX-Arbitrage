import { Info, BookOpen, Code2, Lightbulb, TrendingUp, BrainCircuit } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlgorithmExplanation } from '@/lib/algorithmExplanations';
import { ExampleGraph } from './ExampleGraph';

interface AlgorithmInfoProps {
  explanation: AlgorithmExplanation;
}

export function AlgorithmInfo({ explanation }: AlgorithmInfoProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-2 border-black rounded-none shadow-none">
        <CardHeader className="border-b-2 border-black pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono uppercase text-sm">
              {explanation.name}
            </CardTitle>
            <Badge variant="outline" className="border-black rounded-none font-mono text-xs">
              {explanation.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Alert className="border-2 border-black rounded-none bg-muted/10">
            <Info className="h-4 w-4 text-foreground" />
            <AlertTitle className="font-mono text-xs uppercase">What is this?</AlertTitle>
            <AlertDescription className="text-sm">{explanation.whatIsIt}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Detailed Explanations */}
      <Accordion type="multiple" defaultValue={['theory', 'example']} className="w-full space-y-2">
        
        {/* Consolidated Theory Section */}
        <AccordionItem value="theory" className="border-2 border-black rounded-none last:border-b-2">
          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-2 font-mono text-xs uppercase">
              <BrainCircuit className="h-4 w-4" />
              Theory & Concepts
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* How It Works */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase font-bold flex items-center gap-2">
                   <Code2 className="h-3 w-3" /> Algorithm Logic
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {explanation.howItWorks.map((step, index) => (
                    <li key={index} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Key Concepts */}
              <div className="space-y-2">
                 <h4 className="font-mono text-xs uppercase font-bold flex items-center gap-2">
                    <Lightbulb className="h-3 w-3" /> Key Concepts
                 </h4>
                 <ul className="space-y-2 text-sm text-muted-foreground">
                  {explanation.keyConcepts.map((concept, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-black mt-1.5 h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Graph Theory Details - Full Width */}
              <div className="md:col-span-2 mt-2 pt-4 border-t border-dashed border-zinc-300">
                <h4 className="font-mono text-xs uppercase font-bold flex items-center gap-2 mb-3">
                   <BookOpen className="h-3 w-3" /> Graph Theory Perspective
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="bg-muted/30 p-3 border-l-2 border-black">
                      <span className="block font-semibold text-[10px] uppercase text-muted-foreground mb-1">Purpose</span>
                      <p className="text-sm leading-tight">{explanation.graphTheory.purpose}</p>
                   </div>
                   <div className="bg-muted/30 p-3 border-l-2 border-black">
                      <span className="block font-semibold text-[10px] uppercase text-muted-foreground mb-1">Complexity</span>
                      <p className="font-mono text-sm leading-tight">{explanation.graphTheory.complexity}</p>
                   </div>
                   <div className="bg-muted/30 p-3 border-l-2 border-black">
                      <span className="block font-semibold text-[10px] uppercase text-muted-foreground mb-1">Input/Output</span>
                      <div className="text-sm leading-tight space-y-1">
                        <p><span className="opacity-70">In:</span> {explanation.graphTheory.input}</p>
                        <p><span className="opacity-70">Out:</span> {explanation.graphTheory.output}</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Currency Market Application */}
        <AccordionItem value="domain-app" className="border-2 border-black rounded-none last:border-b-2">
          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-2 font-mono text-xs uppercase">
              <TrendingUp className="h-4 w-4" />
              Currency Market Application
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <span className="font-semibold text-xs uppercase text-muted-foreground">Purpose</span>
                    <p className="text-sm">{explanation.domainApplication.purpose}</p>
                </div>
                <div className="space-y-1">
                    <span className="font-semibold text-xs uppercase text-muted-foreground">What It Finds</span>
                    <p className="text-sm">{explanation.domainApplication.whatItFinds}</p>
                </div>
                <div className="space-y-1">
                    <span className="font-semibold text-xs uppercase text-muted-foreground">Why Useful</span>
                    <p className="text-sm">{explanation.domainApplication.whyUseful}</p>
                </div>
             </div>
          </AccordionContent>
        </AccordionItem>

        {/* Interactive Example */}
        {explanation.example && (
          <AccordionItem value="example" className="border-2 border-black rounded-none last:border-b-2">
            <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2 font-mono text-xs uppercase">
                <BrainCircuit className="h-4 w-4" />
                Interactive Walkthrough
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                
                {/* Left: Text Description */}
                <div className="space-y-4">
                   <div>
                    <span className="font-semibold text-xs uppercase text-muted-foreground block mb-1">
                      Scenario
                    </span>
                    <p className="text-sm italic">{explanation.example.scenario}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-xs uppercase text-muted-foreground block mb-2">
                      Step-by-Step Execution
                    </span>
                    <div className="space-y-3">
                        {explanation.example.steps.map((step, index) => (
                            <div key={index} className="flex gap-3 text-sm group">
                                <span className="font-mono text-muted-foreground opacity-50 select-none">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <p className="leading-relaxed border-b border-transparent group-hover:border-black/10 transition-colors pb-1">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-muted/10 border-2 border-black p-4 rounded-none mt-4">
                    <span className="font-semibold text-xs uppercase text-foreground block mb-1">Final Result</span>
                    <p className="text-sm text-muted-foreground">{explanation.example.result}</p>
                  </div>
                </div>

                {/* Right: Graph Visualization */}
                <div className="min-w-0">
                    {explanation.example.graphData && (
                        <div className="sticky top-4">
                            <span className="font-semibold text-xs uppercase text-muted-foreground block mb-2">
                                Visualization
                            </span>
                            <ExampleGraph 
                                nodes={explanation.example.graphData.nodes} 
                                edges={explanation.example.graphData.edges} 
                            />
                            <p className="text-[10px] text-muted-foreground mt-2 font-mono text-center">
                                * Interactive: Pan & Drag nodes
                            </p>
                        </div>
                    )}
                </div>

              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
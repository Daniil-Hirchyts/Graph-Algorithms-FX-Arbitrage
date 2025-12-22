import { Info, BookOpen, Code2, Lightbulb, TrendingUp } from 'lucide-react';
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
      <Accordion type="multiple" className="w-full space-y-2">
        {/* How It Works */}
        <AccordionItem value="how-it-works" className="border-2 border-black rounded-none last:border-b-2">
          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-2 font-mono text-xs uppercase">
              <Code2 className="h-4 w-4" />
              How It Works
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              {explanation.howItWorks.map((step, index) => (
                <li key={index} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>

        {/* Graph Theory Perspective */}
        <AccordionItem value="graph-theory" className="border-2 border-black rounded-none last:border-b-2">
          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-2 font-mono text-xs uppercase">
              <BookOpen className="h-4 w-4" />
              Graph Theory Perspective
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div>
              <span className="font-semibold text-xs uppercase text-muted-foreground">Purpose:</span>
              <p className="text-sm mt-1">{explanation.graphTheory.purpose}</p>
            </div>
            <div>
              <span className="font-semibold text-xs uppercase text-muted-foreground">Input:</span>
              <p className="text-sm mt-1">{explanation.graphTheory.input}</p>
            </div>
            <div>
              <span className="font-semibold text-xs uppercase text-muted-foreground">Output:</span>
              <p className="text-sm mt-1">{explanation.graphTheory.output}</p>
            </div>
            <div className="bg-muted/30 p-3 border-l-4 border-black">
              <span className="font-semibold text-xs uppercase text-muted-foreground">
                Time Complexity:
              </span>
              <p className="font-mono text-sm mt-1">{explanation.graphTheory.complexity}</p>
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
          <AccordionContent className="px-4 pb-4 space-y-3">
            <div>
              <span className="font-semibold text-xs uppercase text-muted-foreground">Purpose:</span>
              <p className="text-sm mt-1">{explanation.domainApplication.purpose}</p>
            </div>
            <div>
              <span className="font-semibold text-xs uppercase text-muted-foreground">
                What It Finds:
              </span>
              <p className="text-sm mt-1">{explanation.domainApplication.whatItFinds}</p>
            </div>
            <div>
              <span className="font-semibold text-xs uppercase text-muted-foreground">
                Why Useful:
              </span>
              <p className="text-sm mt-1">{explanation.domainApplication.whyUseful}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Example (if available) */}
        {explanation.example && (
          <AccordionItem value="example" className="border-2 border-black rounded-none last:border-b-2">
            <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2 font-mono text-xs uppercase">
                <Lightbulb className="h-4 w-4" />
                Step-by-Step Example
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-3">
              <div>
                <span className="font-semibold text-xs uppercase text-muted-foreground">
                  Scenario:
                </span>
                <p className="text-sm mt-1 italic">{explanation.example.scenario}</p>
              </div>
              <div>
                <span className="font-semibold text-xs uppercase text-muted-foreground">
                  Steps:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
                  {explanation.example.steps.map((step, index) => (
                    <li key={index} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-muted/10 border-2 border-black p-3 rounded-none">
                <span className="font-semibold text-xs uppercase text-foreground">Result:</span>
                <p className="text-sm mt-1 text-muted-foreground">{explanation.example.result}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Key Concepts */}
        <AccordionItem value="key-concepts" className="border-2 border-black rounded-none last:border-b-2">
          <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-2 font-mono text-xs uppercase">
              <Info className="h-4 w-4" />
              Key Concepts
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ul className="space-y-2 text-sm">
              {explanation.keyConcepts.map((concept, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-foreground mt-1">•</span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
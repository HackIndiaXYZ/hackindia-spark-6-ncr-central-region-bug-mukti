
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { categorizeViolation } from '@/ai/flows/violation-categorization-assistant-flow';
import { toast } from '@/hooks/use-toast';

const reportSchema = z.object({
  description: z.string().min(10, "Please provide at least 10 characters describing the violation."),
  location: z.string().min(3, "Location is required."),
  mediaCaptions: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function ReportForm() {
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: "",
      location: "",
      mediaCaptions: "",
    },
  });

  const handleSuggestCategory = async () => {
    const description = form.getValues("description");
    if (description.length < 10) {
      toast({
        title: "More detail needed",
        description: "Please provide a longer description for better AI analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsCategorizing(true);
    try {
      const result = await categorizeViolation({
        description,
        mediaCaptions: form.getValues("mediaCaptions") ? [form.getValues("mediaCaptions")!] : []
      });
      setSuggestedCategory(result.suggestedCategory);
      setConfidence(result.confidenceScore);
      toast({
        title: "Analysis complete",
        description: `Suggested category: ${result.suggestedCategory}`,
      });
    } catch (error) {
      toast({
        title: "Categorization failed",
        description: "The AI was unable to analyze this description. Please select a category manually.",
        variant: "destructive"
      });
    } finally {
      setIsCategorizing(false);
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    try {
      await fetch('http://localhost:5000/submit_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: suggestedCategory || "Unknown Violation",
          vehicle: "Sent via Sentinel App",
          location: data.location,
          reporter: "Active Sentinel User",
          proofImage: proofImage || "/demo.png" // Uses uploaded base64 or fallback
        })
      });
      
      toast({
        title: "Report Submitted & Saved!",
        description: "Thank you for being a Sentinel! Your local feed and master ledger are now updated.",
      });
      form.reset();
      setSuggestedCategory(null);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Could not connect to Flask backend.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full border-2">
      <CardHeader className="bg-secondary/30">
        <CardTitle className="flex items-center gap-2 text-primary font-headline">
          <Camera className="h-5 w-5 text-accent" />
          Submit Violation Report
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    Exact Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 5th Ave & Broadway Intersection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Violation Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe exactly what happened. e.g. A blue sedan was parked in front of a fire hydrant for over 30 minutes..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about colors, car makes, and the nature of the violation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-xl bg-accent/5 p-4 border border-accent/20">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    AI Assistant
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Let our AI suggest the best category for this violation.
                  </p>
                </div>
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleSuggestCategory}
                  disabled={isCategorizing || form.getValues("description").length < 10}
                  className="bg-white hover:bg-accent/10"
                >
                  {isCategorizing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                  Analyze Text
                </Button>
              </div>

              {suggestedCategory && (
                <div className="mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Suggested Category:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" className="bg-primary">{suggestedCategory}</Badge>
                      {confidence && (
                        <span className="text-[10px] text-muted-foreground">
                          Confidence: {(confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="mediaCaptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe your photo or video" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Upload Image Proof (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="cursor-pointer file:cursor-pointer"
                />
              </FormControl>
              {proofImage && (
                <div className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Proof successfully attached!
                </div>
              )}
            </FormItem>

            <Button type="submit" className="w-full h-12 text-lg shadow-md font-bold">
              Submit Report
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

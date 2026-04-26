
import { ReportForm } from '@/components/reports/ReportForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Info } from 'lucide-react';

export default function NewReportPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">New Violation Report</h1>
        <p className="text-muted-foreground">Your report helps build a safer community. Please be as accurate as possible.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        <ReportForm />
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border shadow-sm bg-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Reporting Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                <li>Include the vehicle make and color if known.</li>
                <li>Specify the exact time of the observation.</li>
                <li>Photos/videos are highly encouraged for verification.</li>
                <li>Avoid revealing personal data of individuals.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm bg-secondary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                How AI Helps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Our AI Categorization Assistant analyzes your natural language description to suggest standardized 
                violation types. This ensures data consistency and speeds up official review.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

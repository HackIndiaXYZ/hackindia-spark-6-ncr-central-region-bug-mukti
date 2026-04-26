'use server';
/**
 * @fileOverview This file implements a Genkit flow for categorizing road violations.
 *
 * - categorizeViolation - A function that analyzes violation details and suggests a category.
 * - CategorizeViolationInput - The input type for the categorizeViolation function.
 * - CategorizeViolationOutput - The return type for the categorizeViolation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeViolationInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the observed road violation.'),
  mediaCaptions: z
    .array(z.string())
    .optional()
    .describe('Optional captions for any accompanying media (photos/videos).'),
});
export type CategorizeViolationInput = z.infer<typeof CategorizeViolationInputSchema>;

const CategorizeViolationOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe(
      'The most accurate road violation category based on the input, e.g., "Speeding", "Illegal Parking", "Red Light Violation", "Improper Lane Change", "Driving Under Influence", "Distracted Driving", "Failure to Yield", "Stop Sign Violation", "Illegal Turn", "No Signal", or a specific "Other" category.'
    ),
  confidenceScore: z
    .number()
    .min(0.0)
    .max(1.0)
    .describe(
      'A confidence score (0.0 to 1.0) indicating how certain the model is about the suggested category.'
    ),
});
export type CategorizeViolationOutput = z.infer<typeof CategorizeViolationOutputSchema>;

export async function categorizeViolation(
  input: CategorizeViolationInput
): Promise<CategorizeViolationOutput> {
  return violationCategorizationAssistantFlow(input);
}

const categorizeViolationPrompt = ai.definePrompt({
  name: 'categorizeViolationPrompt',
  input: {schema: CategorizeViolationInputSchema},
  output: {schema: CategorizeViolationOutputSchema},
  prompt: `You are an AI assistant specialized in categorizing road violations. Analyze the provided description and any media captions to determine the most accurate road violation category. Provide a confidence score for your suggestion.

Here are some common road violation categories to consider and use as your primary output, if applicable:
- Speeding
- Illegal Parking
- Red Light Violation
- Improper Lane Change
- Driving Under Influence
- Distracted Driving
- Failure to Yield
- Stop Sign Violation
- Illegal Turn
- No Signal
- Other (if none of the above fit well, specify briefly, e.g., "Other: Loud exhaust")

Description: {{{description}}}

{{#if mediaCaptions}}
Media Captions:
{{#each mediaCaptions}}
- {{{this}}}
{{/each}}
{{/if}}

Output your response in JSON format according to the CategorizeViolationOutputSchema.`,
});

const violationCategorizationAssistantFlow = ai.defineFlow(
  {
    name: 'violationCategorizationAssistantFlow',
    inputSchema: CategorizeViolationInputSchema,
    outputSchema: CategorizeViolationOutputSchema,
  },
  async input => {
    const {output} = await categorizeViolationPrompt(input);
    return output!;
  }
);

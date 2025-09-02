<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class ProductPromptGeneratorController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string|min:30',
        ]);

        $prompt = $request->input('prompt');

        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o',
                'temperature' => 0.8,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a product generator assistant that generates product name, content and description based on the prompt provided by the user. 
                        The platform is a digital e-commerce platform that sells products to customers. 
                        Your output should be JSON with the following format:
                        {
                            "name": "Product Name",
                            "description": "Short product description (1-2 sentences)",
                            "content": "Detailed product description with multiple paragraphs and bullet points (you can use html tags for this)"
                        }'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ],
                ],
            ]);

            $content = $response->choices[0]->message->content;

            $data = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $data = [
                    'name' => 'Generated Product',
                    'description' => 'Generated from your prompt',
                    'content' => $content
                ];
            }

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

"use client";

import { useState } from "react";
import { Loading, PageLoading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoadingTestPage() {
  const [showPageLoading, setShowPageLoading] = useState(false);
  const [showSmallLoading, setShowSmallLoading] = useState(false);
  const [showDefaultLoading, setShowDefaultLoading] = useState(false);
  const [showLargeLoading, setShowLargeLoading] = useState(false);

  const simulateLoading = (setter, duration = 2000) => {
    setter(true);
    setTimeout(() => setter(false), duration);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loading Component Test
          </h1>
          <p className="text-gray-600">
            Click the buttons below to test different loading states
          </p>
        </div>

        {/* Page Loading Test */}
        <Card>
          <CardHeader>
            <CardTitle>Page Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => simulateLoading(setShowPageLoading, 3000)}
              disabled={showPageLoading}
              className="w-full"
            >
              {showPageLoading ? "Loading..." : "Show Page Loading (3s)"}
            </Button>
            {showPageLoading && <PageLoading />}
          </CardContent>
        </Card>

        {/* Different Size Loaders */}
        <Card>
          <CardHeader>
            <CardTitle>Different Sizes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Small Loading:</span>
              <div className="flex items-center gap-4">
                <Loading size="sm" />
                <Button
                  size="sm"
                  onClick={() => simulateLoading(setShowSmallLoading)}
                  disabled={showSmallLoading}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Default Loading:</span>
              <div className="flex items-center gap-4">
                <Loading size="default" />
                <Button
                  size="sm"
                  onClick={() => simulateLoading(setShowDefaultLoading)}
                  disabled={showDefaultLoading}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Large Loading:</span>
              <div className="flex items-center gap-4">
                <Loading size="lg" />
                <Button
                  size="sm"
                  onClick={() => simulateLoading(setShowLargeLoading)}
                  disabled={showLargeLoading}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Extra Large Loading:</span>
              <div className="flex items-center gap-4">
                <Loading size="xl" />
                <Button
                  size="sm"
                  onClick={() => simulateLoading(setShowLargeLoading)}
                  disabled={showLargeLoading}
                >
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Styling */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Styling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Loading className="text-blue-600" />
              <span>Blue loading</span>
            </div>
            <div className="flex items-center gap-4">
              <Loading className="text-green-600" />
              <span>Green loading</span>
            </div>
            <div className="flex items-center gap-4">
              <Loading className="text-red-600" />
              <span>Red loading</span>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Page Loading:</h4>
              <code className="text-sm text-gray-700">
                {`import { PageLoading } from '@/components/ui/loading';\n\n<PageLoading />`}
              </code>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Custom Loading:</h4>
              <code className="text-sm text-gray-700">
                {`import { Loading } from '@/components/ui/loading';\n\n<Loading size="lg" className="text-blue-600" />`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

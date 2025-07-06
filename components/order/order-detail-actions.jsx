import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

export function OrderDetailActions({
  onPrint,
  onDownload,
  isPrinting,
  isDownloading,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
      <Button
        onClick={onPrint}
        disabled={isPrinting}
        className="flex-1"
        variant="outline"
        size="lg"
      >
        <Printer className="h-4 w-4 mr-2" />
        {isPrinting ? "Printing..." : "Print Receipt"}
      </Button>
      <Button
        onClick={onDownload}
        disabled={isDownloading}
        className="flex-1"
        variant="outline"
        size="lg"
      >
        <Download className="h-4 w-4 mr-2" />
        {isDownloading ? "Downloading..." : "Download Receipt"}
      </Button>
    </div>
  );
}

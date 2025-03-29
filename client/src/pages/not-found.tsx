import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logoPath from "@/assets/logo.svg";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-light">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex justify-center mb-6">
            <img 
              src={logoPath} 
              alt="מערכת אחזקה - מפעלי ים המלח" 
              className="h-16 w-auto"
            />
          </div>
          
          <div className="flex mb-4 gap-2 items-center justify-center">
            <AlertCircle className="h-8 w-8 text-danger" />
            <h1 className="text-2xl font-bold text-neutral-dark">הדף לא נמצא (404)</h1>
          </div>

          <p className="mt-2 text-sm text-neutral-dark text-center mb-6">
            העמוד שחיפשת אינו קיים או שהועבר למיקום אחר
          </p>
          
          <div className="flex justify-center">
            <Link href="/">
              <Button className="w-full max-w-[200px]">
                חזרה לדף הבית
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

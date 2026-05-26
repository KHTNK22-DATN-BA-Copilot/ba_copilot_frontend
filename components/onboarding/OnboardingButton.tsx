import { TooltipRenderProps } from "react-joyride";
import { Button } from "@/components/ui/button"; // Đường dẫn đến Shadcn Button của bạn
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"; // Tùy chọn dùng Card của Shadcn

export const ShadcnTooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    skipProps,
    isLastStep,
}: TooltipRenderProps) => {
    return (
        <Card className="max-w-[400px] shadow-xl border-2">
            <CardHeader className="pb-2">
                {step.title && (
                    <CardTitle className="text-lg font-bold">
                        {step.title}
                    </CardTitle>
                )}
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
                {step.content}
            </CardContent>

            {!step.data?.hideFooter && (
                <CardFooter className="flex justify-between pt-2">
                    {!isLastStep && (
                        <Button variant="ghost" size="sm" {...skipProps} className="hover:cursor-pointer">
                            Skip
                        </Button>
                    )}
                    <div className="flex gap-2 ml-auto">
                        {index > 0 && (
                            <Button variant="outline" size="sm" {...backProps} className="hover:cursor-pointer">
                                Back
                            </Button>
                        )}
                        <Button size="sm" {...primaryProps} className="hover:cursor-pointer">
                            {isLastStep ? "Finish" : "Next"}
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

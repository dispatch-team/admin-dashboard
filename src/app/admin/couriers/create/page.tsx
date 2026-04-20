"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Truck, ChevronLeft, Save, Loader2, ClipboardCheck, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/intl";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const createSchema = (t: any) => z.object({
  company_name: z.string().min(2, t("validation.minLength", { count: 2 })),
  company_address: z.string().min(5, t("validation.minLength", { count: 5 })),
  phone_number: z.string().min(10, t("validation.minLength", { count: 10 })),
  email: z.string().email(t("validation.invalidEmail")),
  website_url: z.string().url(t("validation.invalidUrl")).optional().or(z.literal("")),
  owner_first_name: z.string().min(2, t("validation.minLength", { count: 2 })),
  owner_last_name: z.string().min(2, t("validation.minLength", { count: 2 })),
  owner_password: z.string().min(8, t("validation.minLength", { count: 8 })),
  confirm_password: z.string().min(8, t("validation.minLength", { count: 8 })),
  max_weight: z.coerce.number().positive(t("validation.positiveNumber")),
  base_price: z.coerce.number().nonnegative(t("validation.positiveNumber")),
  weight_rate: z.coerce.number().nonnegative(t("validation.positiveNumber")),
  distance_rate: z.coerce.number().nonnegative(t("validation.positiveNumber")),
  time_rate: z.coerce.number().nonnegative(t("validation.positiveNumber")),
}).refine((data) => data.owner_password === data.confirm_password, {
  message: t("validation.passwordMismatch"),
  path: ["confirm_password"],
});

type CreateFormValues = z.infer<ReturnType<typeof createSchema>>;

enum FormStep {
  EDIT = "EDIT",
  REVIEW = "REVIEW"
}

export default function CreateCourierPage() {
  const t = useI18n("couriers");
  const tCommon = useI18n("common");
  const router = useRouter();
  const { getValidAccessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<FormStep>(FormStep.EDIT);
  const [formData, setFormData] = useState<CreateFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema(t)),
    defaultValues: {
      max_weight: 50,
      base_price: 100,
      weight_rate: 5.5,
      distance_rate: 2,
      time_rate: 1.5,
    }
  });

  const onContinueToReview = (values: CreateFormValues) => {
    setFormData(values);
    setStep(FormStep.REVIEW);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFinalSubmit = async () => {
    if (!formData) return;
    
    setIsSubmitting(true);
    try {
      const token = await getValidAccessToken();
      if (!token) {
        toast.error(tCommon("authRequired"));
        return;
      }

      // Remove confirm_password before sending to API
      const { confirm_password, ...payload } = formData;

      const response = await fetch("/api/admin/couriers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || t("errorMessage"));
      }

      toast.success(t("successMessage"));
      router.push("/admin/couriers");
    } catch (err: any) {
      toast.error(err.message || t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const ReviewItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-widest font-black opacity-40">{label}</p>
      <p className="text-sm font-bold text-foreground break-all">{value || "—"}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => step === FormStep.REVIEW ? setStep(FormStep.EDIT) : router.back()}
            className="rounded-xl pl-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="font-bold uppercase tracking-widest text-[10px]">{tCommon("back")}</span>
          </Button>
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
            {step === FormStep.EDIT ? (
              <>
                <Truck className="h-10 w-10 text-primary" />
                {t("createTitle")}
              </>
            ) : (
              <>
                <ClipboardCheck className="h-10 w-10 text-primary" />
                {t("reviewTitle")}
              </>
            )}
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            {step === FormStep.EDIT ? t("createSubtitle") : t("reviewSubtitle")}
          </p>
        </div>
      </header>

      {step === FormStep.EDIT ? (
        <form onSubmit={handleSubmit(onContinueToReview)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Business Details */}
            <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black tracking-tight">{t("businessDetails")}</CardTitle>
                <CardDescription className="font-medium">{t("businessDetailsDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("companyName")}</Label>
                  <Input 
                    {...register("company_name")}
                    placeholder="e.g. FastTrack Logistics"
                    className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.company_name ? "border-destructive/60" : ""}`}
                  />
                  {errors.company_name && <p className="text-[10px] text-destructive font-bold ml-1">{errors.company_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("companyAddress")}</Label>
                  <Input 
                    {...register("company_address")}
                    placeholder="e.g. Bole Road, Addis Ababa"
                    className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.company_address ? "border-destructive/60" : ""}`}
                  />
                  {errors.company_address && <p className="text-[10px] text-destructive font-bold ml-1">{errors.company_address.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("phoneNumber")}</Label>
                  <Input 
                    {...register("phone_number")}
                    placeholder="+251..."
                    className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.phone_number ? "border-destructive/60" : ""}`}
                  />
                  {errors.phone_number && <p className="text-[10px] text-destructive font-bold ml-1">{errors.phone_number.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("email")}</Label>
                  <Input 
                    {...register("email")}
                    type="email"
                    placeholder="info@company.com"
                    className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.email ? "border-destructive/60" : ""}`}
                  />
                  {errors.email && <p className="text-[10px] text-destructive font-bold ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("websiteUrl")}</Label>
                  <Input 
                    {...register("website_url")}
                    placeholder="https://..."
                    className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.website_url ? "border-destructive/60" : ""}`}
                  />
                  {errors.website_url && <p className="text-[10px] text-destructive font-bold ml-1">{errors.website_url.message}</p>}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {/* Owner Account */}
              <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">{t("ownerAccount")}</CardTitle>
                  <CardDescription className="font-medium">{t("ownerAccountDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("ownerFirstName")}</Label>
                      <Input 
                        {...register("owner_first_name")}
                        placeholder={t("firstNamePlaceholder")}
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.owner_first_name ? "border-destructive/60" : ""}`}
                      />
                      {errors.owner_first_name && <p className="text-[10px] text-destructive font-bold ml-1">{errors.owner_first_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("ownerLastName")}</Label>
                      <Input 
                        {...register("owner_last_name")}
                        placeholder={t("lastNamePlaceholder")}
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.owner_last_name ? "border-destructive/60" : ""}`}
                      />
                      {errors.owner_last_name && <p className="text-[10px] text-destructive font-bold ml-1">{errors.owner_last_name.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("ownerPassword")}</Label>
                      <Input 
                        {...register("owner_password")}
                        type="password"
                        placeholder="••••••••"
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.owner_password ? "border-destructive/60" : ""}`}
                      />
                      {errors.owner_password && <p className="text-[10px] text-destructive font-bold ml-1">{errors.owner_password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("confirmPassword")}</Label>
                      <Input 
                        {...register("confirm_password")}
                        type="password"
                        placeholder="••••••••"
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.confirm_password ? "border-destructive/60" : ""}`}
                      />
                      {errors.confirm_password && <p className="text-[10px] text-destructive font-bold ml-1">{errors.confirm_password.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Config */}
              <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">{t("pricingConfig")}</CardTitle>
                  <CardDescription className="font-medium">{t("pricingConfigDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("maxWeight")}</Label>
                      <Input 
                        {...register("max_weight")}
                        type="number"
                        step="0.1"
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.max_weight ? "border-destructive/60" : ""}`}
                      />
                      {errors.max_weight && <p className="text-[10px] text-destructive font-bold ml-1">{errors.max_weight.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("basePrice")}</Label>
                      <Input 
                        {...register("base_price")}
                        type="number"
                        step="0.1"
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.base_price ? "border-destructive/60" : ""}`}
                      />
                      {errors.base_price && <p className="text-[10px] text-destructive font-bold ml-1">{errors.base_price.message}</p>}
                    </div>
                  </div>

                  <Separator className="bg-border/40" />

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("weightRate")}</Label>
                      <Input 
                        {...register("weight_rate")}
                        type="number"
                        step="0.01"
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.weight_rate ? "border-destructive/60" : ""}`}
                      />
                      {errors.weight_rate && <p className="text-[10px] text-destructive font-bold ml-1">{errors.weight_rate.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("distanceRate")}</Label>
                      <Input 
                        {...register("distance_rate")}
                        type="number"
                        step="0.01"
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.distance_rate ? "border-destructive/60" : ""}`}
                      />
                      {errors.distance_rate && <p className="text-[10px] text-destructive font-bold ml-1">{errors.distance_rate.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{t("timeRate")}</Label>
                      <Input 
                        {...register("time_rate")}
                        type="number"
                        step="0.01"
                        className={`h-12 rounded-2xl border-border/60 bg-muted/20 font-semibold focus-visible:ring-primary/20 ${errors.time_rate ? "border-destructive/60" : ""}`}
                      />
                      {errors.time_rate && <p className="text-[10px] text-destructive font-bold ml-1">{errors.time_rate.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl h-14 px-8 font-bold border-border/60 hover:bg-muted"
              onClick={() => router.back()}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              type="submit"
              className="rounded-2xl h-14 px-10 font-black shadow-lg shadow-primary/20 min-w-[200px]"
            >
              {tCommon("next")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Business Details Review */}
            <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black tracking-tight">{t("businessDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <ReviewItem label={t("companyName")} value={formData?.company_name} />
                <ReviewItem label={t("companyAddress")} value={formData?.company_address} />
                <ReviewItem label={t("phoneNumber")} value={formData?.phone_number} />
                <ReviewItem label={t("email")} value={formData?.email} />
                <ReviewItem label={t("websiteUrl")} value={formData?.website_url} />
              </CardContent>
            </Card>

            <div className="space-y-8">
              {/* Owner Account Review */}
              <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">{t("ownerAccount")}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <ReviewItem label={t("ownerFirstName")} value={formData?.owner_first_name} />
                    <ReviewItem label={t("ownerLastName")} value={formData?.owner_last_name} />
                  </div>
                  <ReviewItem label={t("ownerPassword")} value="••••••••" />
                </CardContent>
              </Card>

              {/* Pricing Review */}
              <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">{t("pricingConfig")}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <ReviewItem label={t("maxWeight")} value={`${formData?.max_weight} ${tCommon("kg")}`} />
                    <ReviewItem label={t("basePrice")} value={`${formData?.base_price} ${tCommon("etb")}`} />
                  </div>
                  <Separator className="bg-border/20" />
                  <ReviewItem label={t("weightRate")} value={`${formData?.weight_rate} ${tCommon("etbPerKg")}`} />
                  <ReviewItem label={t("distanceRate")} value={`${formData?.distance_rate} ${tCommon("etbPerKm")}`} />
                  <ReviewItem label={t("timeRate")} value={`${formData?.time_rate} ${tCommon("etbPerMin")}`} />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl h-14 px-8 font-bold border-border/60 hover:bg-muted"
              onClick={() => setStep(FormStep.EDIT)}
              disabled={isSubmitting}
            >
              <Edit3 className="mr-2 h-5 w-5" />
              {t("backToEdit")}
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onFinalSubmit}
              className="rounded-2xl h-14 px-10 font-black shadow-lg shadow-primary/20 min-w-[220px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {tCommon("saving")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {t("confirmAndRegister")}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

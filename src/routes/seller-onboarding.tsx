import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useUser, SignInButton, SignUpButton } from "@clerk/react";
import { BadgeCheck, LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getSellerProfile,
  readFileAsDataUrl,
  upsertSellerProfile,
  type SellerProfile,
} from "@/lib/sellerProfiles";

export const Route = createFileRoute("/seller-onboarding")({
  head: () => ({
    meta: [
      { title: "Seller Onboarding | Artisans Market" },
      {
        name: "description",
        content: "Complete your seller profile with verification details before listing products.",
      },
    ],
  }),
  component: SellerOnboardingPage,
});

function SellerOnboardingPage() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<SellerProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [governmentIdType, setGovernmentIdType] = useState("Aadhaar Card");
  const [governmentIdNumber, setGovernmentIdNumber] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [governmentIdFile, setGovernmentIdFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [governmentIdPreview, setGovernmentIdPreview] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!isSignedIn || !user) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const result = await getSellerProfile(user.id);

      if (!isMounted) return;

      setExistingProfile(result.data);
      setFullName(result.data?.full_name ?? [user.firstName, user.lastName].filter(Boolean).join(" "));
      setPhoneNumber(result.data?.phone_number ?? "");
      setAddress(result.data?.address ?? "");
      setGovernmentIdType(result.data?.government_id_type ?? "Aadhaar Card");
      setGovernmentIdNumber(result.data?.government_id_number ?? "");
      setProfilePhotoPreview(result.data?.profile_photo_url ?? "");
      setGovernmentIdPreview(result.data?.government_id_url ?? "");
      setLoading(false);

      if (result.error) {
        toast.error(result.error);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isSignedIn, user?.id]);

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setProfilePhotoFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file for the profile photo.");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setProfilePhotoFile(file);
      setProfilePhotoPreview(dataUrl);
    } catch {
      toast.error("Unable to read the profile photo. Please choose another file.");
      event.target.value = "";
    }
  }

  async function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setGovernmentIdFile(null);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setGovernmentIdFile(file);
      setGovernmentIdPreview(dataUrl);
    } catch {
      toast.error("Unable to read the government document. Please choose another file.");
      event.target.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSignedIn || !user) {
      toast.error("Please sign in first.");
      return;
    }

    if (!fullName.trim() || !phoneNumber.trim() || !address.trim() || !governmentIdType.trim() || !governmentIdNumber.trim()) {
      toast.error("Please fill in all seller details.");
      return;
    }

    setSaving(true);

    try {
      const profilePhotoUrl = profilePhotoFile
        ? await readFileAsDataUrl(profilePhotoFile)
        : existingProfile?.profile_photo_url ?? null;
      const governmentIdUrl = governmentIdFile
        ? await readFileAsDataUrl(governmentIdFile)
        : existingProfile?.government_id_url ?? null;

      const result = await upsertSellerProfile({
        clerkUserId: user.id,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        governmentIdType: governmentIdType.trim(),
        governmentIdNumber: governmentIdNumber.trim(),
        profilePhotoUrl,
        governmentIdUrl,
      });

      if (!result.data) {
        toast.error(result.error ?? "Unable to save seller profile.");
        return;
      }

      setExistingProfile(result.data);
      toast.success("Seller profile saved. Admin review is pending.");
      navigate({ to: "/" });
    } catch {
      toast.error("Unable to save seller profile right now.");
    } finally {
      setSaving(false);
    }
  }

  if (!isSignedIn) {
    return (
      <section className="min-h-screen bg-bg-warm px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl">
          <Card className="border border-card-warm-border bg-card-warm p-8 md:p-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted-warm">Seller onboarding</p>
            <h1 className="mt-3 font-display text-3xl text-foreground">Sign in to continue</h1>
            <p className="mt-4 text-sm leading-[1.8] text-text-muted-warm">
              Create your account first, then complete your seller profile with verification details.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <SignInButton mode="modal">
                <button className="border border-foreground px-4 py-2 text-[10px] uppercase tracking-[0.15em] hover:bg-foreground hover:text-text-light transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" afterSignUpUrl="/seller-onboarding">
                <button className="bg-foreground px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-text-light transition-colors hover:bg-foreground/90">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-bg-warm px-6 py-20 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted-warm">Seller onboarding</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">Complete your profile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-[1.8] text-text-muted-warm">
            Add your details and government document so an admin can verify your account manually.
          </p>
        </div>

        {loading ? (
          <Card className="flex items-center gap-3 border border-card-warm-border bg-card-warm p-6 text-text-muted-warm">
            <LoaderCircle className="h-5 w-5 animate-spin text-accent-amber" />
            Loading your seller profile...
          </Card>
        ) : (
          <Card className="border border-card-warm-border bg-card-warm p-6 md:p-8">
            {existingProfile && (
              <div className="mb-6 rounded-lg bg-bg-warm px-4 py-3 text-sm text-foreground">
                <span className="font-semibold">Current status:</span> {existingProfile.verification_status}
                {existingProfile.is_blocked ? " - blocked" : ""}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="seller-full-name">Full name</Label>
                <Input
                  id="seller-full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full legal name"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seller-phone-number">Phone number</Label>
                  <Input
                    id="seller-phone-number"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="9876543210"
                    inputMode="tel"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller-government-id-type">Gov. document type</Label>
                  <Input
                    id="seller-government-id-type"
                    value={governmentIdType}
                    onChange={(event) => setGovernmentIdType(event.target.value)}
                    placeholder="Aadhaar Card"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller-address">Address</Label>
                <Textarea
                  id="seller-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Your full address"
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seller-government-id-number">Gov. document number</Label>
                  <Input
                    id="seller-government-id-number"
                    value={governmentIdNumber}
                    onChange={(event) => setGovernmentIdNumber(event.target.value)}
                    placeholder="Document number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller-profile-photo">Profile photo</Label>
                  <label
                    htmlFor="seller-profile-photo"
                    className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-card-warm-border bg-bg-warm/60 px-4 py-6 text-center transition-colors hover:border-accent-amber hover:bg-accent-amber/5"
                  >
                    <Upload className="h-5 w-5 text-accent-amber" />
                    <span className="text-sm text-foreground">Upload a seller photo</span>
                    <input
                      id="seller-profile-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller-government-document">Government document upload</Label>
                <label
                  htmlFor="seller-government-document"
                  className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-card-warm-border bg-bg-warm/60 px-4 py-6 text-center transition-colors hover:border-accent-amber hover:bg-accent-amber/5"
                >
                  <BadgeCheck className="h-5 w-5 text-accent-amber" />
                  <span className="text-sm text-foreground">Upload Aadhaar, PAN, or another document</span>
                  <input
                    id="seller-government-document"
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleDocumentChange}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {profilePhotoPreview && (
                  <div className="overflow-hidden rounded-xl border border-card-warm-border bg-white">
                    <img src={profilePhotoPreview} alt="Profile preview" className="h-56 w-full object-cover" />
                  </div>
                )}
                {governmentIdPreview && (
                  <div className="rounded-xl border border-card-warm-border bg-white p-4">
                    <p className="text-sm font-medium text-foreground">Document preview</p>
                    {governmentIdPreview.startsWith("data:image") ? (
                      <img src={governmentIdPreview} alt="Document preview" className="mt-3 h-56 w-full object-contain" />
                    ) : (
                      <a
                        href={governmentIdPreview}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm text-accent-amber underline"
                      >
                        Open uploaded document
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-accent-amber hover:bg-accent-amber-hover text-white"
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Saving profile
                    </>
                  ) : (
                    "Save seller profile"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>
                  Back to home
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </section>
  );
}

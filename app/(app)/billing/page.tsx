"use client";
import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useUserStore } from "@/store/UserStore";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Check, CreditCard, GitBranch, Shield, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const perCreditCost=0.05;   // 5 cent per credit
const BillingPage = () => {
  const [credits, setCredits] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const user=useUserStore();
  const {isSignedIn,isLoaded}=useUser();
  const calculateAmountToPay = (credits:number)=>{
    return credits * perCreditCost;
  }
  const [amountToPay,setAmountToPay]=useState(calculateAmountToPay(50));
  const handleSliderChange= (value:number[])=> {
    setCredits(value[0]);
    setAmountToPay(calculateAmountToPay(value[0]));
  }

  useEffect(()=>{
    if(isLoaded && isSignedIn){
      user.getUser();
    }
  },[isLoaded,isSignedIn])

  if (!isLoaded || !user || user.id === "") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 flex flex-col items-center shadow-xl">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-4 animate-spin"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 shadow-xl">
              <GitBranch size={64} className="text-gray-600 mx-auto mb-4" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to RepoMind
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Your intelligent repository assistant. Sign in to access your
            projects, ask questions about your code, and manage your repositories.
          </p>
          
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-6 rounded-2xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
          >
            <Link href="/sign-in" className="flex items-center gap-3">
              Sign In to Continue
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-blue-300 to-purple-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full px-6 py-3 mb-6 shadow-lg">
            <Sparkles className="text-amber-500" size={20} />
            <span className="text-gray-700 font-medium">Welcome back, {user.name}</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Power up your development workflow with AI-driven insights and unlimited possibilities
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Stats Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 h-fit sticky top-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl shadow-md">
                  <GitBranch className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold text-lg">Your Workspace</h3>
                  <p className="text-gray-500 text-sm">Current status</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-600">Total Projects</span>
                  <span className="text-2xl font-bold text-gray-800">{user.repos.length}</span>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-amber-500" size={16} />
                    <span className="text-gray-700 font-medium">Pro Tip</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Credits roll over monthly, so you never lose what you don't use!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Billing Card */}
          <div className="lg:col-span-2">
            <div className="bg-slate-100 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Credits</h2>
                <p className="text-gray-600">Choose the perfect amount for your needs</p>
              </div>

              {/* Credit Selector */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Credits</span>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-800">{credits}</div>
                    <div className="text-sm text-gray-500">credits selected</div>
                  </div>
                </div>
                
                <div className="relative">
                  <Slider
                    defaultValue={[50]}
                    min={10}
                    max={500}
                    step={10}
                    value={[credits]}
                    onValueChange={handleSliderChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>10</span>
                    <span>250</span>
                    <span>500</span>
                  </div>
                </div>
              </div>

              {/* Pricing Display */}
              <div 
                className={`bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-2xl p-6 mb-8 transition-all duration-300 ${isHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Total Amount</div>
                    <div className="text-4xl font-bold text-gray-800">
                      ${amountToPay.toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      ${perCreditCost.toFixed(2)} per credit
                    </div>
                  </div>
                  <div className="text-6xl opacity-20">
                    <CreditCard className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Credit Usage Info */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
                  <Zap className="text-amber-500" size={20} />
                  How Credits Work
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-500 rounded-full mt-1">
                      <Check size={12} className="text-white" />
                    </div>
                    <div>
                      <div className="text-gray-700 font-medium">Repository Upload</div>
                      <div className="text-gray-500 text-sm">50 credits per repository analysis</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-purple-500 rounded-full mt-1">
                      <Check size={12} className="text-white" />
                    </div>
                    <div>
                      <div className="text-gray-700 font-medium">AI Questions</div>
                      <div className="text-gray-500 text-sm">5 credits per AI interaction</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-500 rounded-full mt-1">
                      <Shield size={12} className="text-white" />
                    </div>
                    <div>
                      <div className="text-gray-700 font-medium">Never Expire</div>
                      <div className="text-gray-500 text-sm">Unused credits roll over monthly</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 rounded-2xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                onClick={() => console.log('Proceeding to payment...')}
              >
                <div className="flex items-center justify-center gap-3">
                  <CreditCard size={20} />
                  Proceed to Payment
                  <ArrowRight size={20} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
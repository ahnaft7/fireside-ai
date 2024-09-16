'use client'
import React from 'react'
import Image from "next/image";
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { CheckCircle, Code, Mic, Users, Check, Facebook, Linkedin, Twitter, Youtube, Instagram } from "lucide-react"
import Link from 'next/link'

const ScrollAnimatedSection = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

const features = [
  { 
    icon: <Mic className="w-12 h-12 text-[#FCD19C]" />, 
    title: "Voice Recognition", 
    description: "Our advanced AI understands and analyzes your speech patterns, providing real-time feedback on your communication skills."
  },
  { 
    icon: <Code className="w-12 h-12 text-[#FCD19C]" />, 
    title: "AI-Powered Feedback", 
    description: "Receive instant, personalized feedback on your responses, helping you improve your interview performance with each practice session."
  },
  { 
    icon: <Users className="w-12 h-12 text-[#FCD19C]" />, 
    title: "Industry-Specific Questions", 
    description: "Practice with a vast database of questions tailored to your industry, ensuring you're prepared for any interview scenario."
  },
  { 
    icon: <CheckCircle className="w-12 h-12 text-[#FCD19C]" />, 
    title: "Performance Tracking", 
    description: "Monitor your progress over time with detailed analytics and insights, helping you focus on areas that need improvement."
  },
]

const useCases = [
  "Fresh Graduates",
  "Career Changers",
  "Senior Professionals",
  "Tech Interviews",
  "Behavioral Interviews",
  "Leadership Roles",
]

const testimonials = [
  {
    name: "John Doe",
    role: "Software Engineer",
    content: "This platform helped me ace my technical interviews and land my dream job! The AI-powered feedback was spot-on and helped me improve rapidly.",
  },
  {
    name: "Jane Smith",
    role: "Marketing Manager",
    content: "The AI feedback was incredibly helpful in improving my communication skills. I felt much more confident in my interviews after using this platform.",
  },
  {
    name: "Alex Johnson",
    role: "Recent Graduate",
    content: "I felt so much more confident going into my first job interviews after using this platform. The industry-specific questions were particularly helpful.",
  },
  {
    name: "Emily Brown",
    role: "Data Scientist",
    content: "The industry-specific questions really prepared me for my interviews in the tech sector. I was able to showcase my skills effectively thanks to this platform.",
  },
  {
    name: "Michael Lee",
    role: "Product Manager",
    content: "This tool helped me transition into a new career by focusing on transferable skills. The personalized feedback was invaluable in my interview preparation.",
  },
  {
    name: "Sarah Wilson",
    role: "HR Professional",
    content: "As a recruiter, I recommend this platform to all job seekers. It's incredibly effective in preparing candidates for real-world interview scenarios.",
  },
]

const companies = [
  { name: "Apple", logo: "/apple.svg?height=50&width=150" },
  { name: "Netflix", logo: "/netflix.svg?height=50&width=150" },
  { name: "LinkedIn", logo: "/linkedin.svg?height=50&width=150" },
  { name: "Amazon", logo: "/amazon.svg?height=50&width=150" },
  { name: "Meta", logo: "/meta.svg?height=50&width=150" },
  { name: "Google", logo: "/google.svg?height=50&width=150" },
]

const ContinuousCarousel = ({ items }) => {

  const itemWidth = 150; // Adjust based on your item width
  const gap = 50; // Adjust gap between items

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-block"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
      >
        {items.concat(items).map((item, index) => (
          <div key={index} className="inline-block mx-4 align-middle" style={{ marginRight: gap }}>
            {'logo' in item ? (
              <img src={item.logo} alt={item.name} className="h-32 w-auto" />
            ) : (
              <Card className="bg-[#333333] border-[#444444] w-[300px] h-[250px] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="text-[#FCD19C] text-sm">{item.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm whitespace-normal h-[150px] overflow-y-auto">"{item.content}"</p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const PricingPlan = ({ title, price, features, buttonText }) => (
  <Card className="bg-[#333333] border-[#444444] w-full max-w-sm transition-transform duration-300 ease-in-out hover:scale-105">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription className="text-3xl font-bold text-[#FCD19C]">{price}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-[#FCD19C]" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button className="w-full bg-[#FCD19C] hover:bg-[#f8c27e] text-[#2A2A2A] font-bold py-2 px-4 rounded">
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
)

const Footer = () => {
  return (
    <footer className="bg-[#222222] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* Logo Image */}
              <img src="/fireside_logo.png" alt="Fireside AI Logo" className="w-8 h-8" />
              <h2 className="text-2xl font-bold text-[#FCD19C]">Fireside AI</h2>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-[#FCD19C]">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#FCD19C]">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#FCD19C]">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#FCD19C]">
                <Youtube size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#FCD19C]">
                <Instagram size={20} />
              </Link>
            </div>
            <p className="text-sm text-gray-300">
              A team based in New York City
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FCD19C]">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">AI Mock Interview</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">AI Interview Flashcards</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FCD19C]">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Testimonials</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Refund Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FCD19C]">Blogs</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">Discover AI Mock Interview</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Discover AI Interview Flashcards</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Popular Tools for Interview 2024</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">How to Stand Out During an Interview</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Interview Tips for New Grads</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">AI Mock Interview Success Story</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Fireside AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#2A2A2A] text-white font-sans">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-40 pb-20 text-center">
        <div className="max-w-screen-xl mx-auto">
          <h3 className="text-[#FCD19C] text-sm font-semibold mb-4">AI MOCK INTERVIEW PLATFORM</h3>
          <h1 className="mb-4 text-4xl sm:text-5xl font-bold leading-tight">
            Prepare for your next interview with AI
          </h1>
          <p className="mb-8 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Get real-time feedback, tailored questions, and AI-driven interview analysis to help you ace your next interview.
          </p>
          <Link href="/interview" passHref>
            <Button className="bg-[#FCD19C] hover:bg-[#f8c27e] text-[#2A2A2A] font-bold py-3 px-6 rounded-md text-lg">
              Start a Mock Interview
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistics and Companies Section */}
      <section className="py-16 bg-[#222222]">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-around mb-12">
            <div className="text-center flex-grow basis-1/3 sm:w-auto mb-4 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCD19C]">96%</h2>
              <p className="text-gray-300">Interview Success Rate</p>
            </div>
            <div className="text-center flex-grow basis-1/3 sm:w-auto mb-4 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCD19C]">1000+</h2>
              <p className="text-gray-300">Interviews Aced</p>
            </div>
            <div className="text-center flex-grow basis-1/3 sm:w-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCD19C]">500+</h2>
              <p className="text-gray-300">Offers</p>
            </div>
          </div>
          <div className="mt-8 overflow-hidden">
            <ContinuousCarousel items={companies} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Key Features</h2>
          {features.map((feature, index) => (
            <ScrollAnimatedSection key={index}>
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:mb-8 md:mr-8 md:flex-row' : 'md:mb-8 md:ml-8 md:flex-row-reverse'} items-center mb-20`}>
                <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                  <Card className="bg-[#333333] border-[#444444]">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl sm:text-2xl">
                        {feature.icon}
                        <span className="ml-4">{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-base sm:text-lg">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="w-full lg:w-1/2 md:px-8 lg:px-8">
                  <div className="bg-[#333333] p-6 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-xl sm:text-2xl font-semibold text-center">Visual Representation of {feature.title}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimatedSection>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-[#222222]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Use Cases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <ScrollAnimatedSection key={index}>
                <Card className="bg-[#333333] border-[#444444]">
                  <CardHeader>
                    <CardTitle>{useCase}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Perfect for {useCase.toLowerCase()} looking to improve their interview skills and confidence.
                    </p>
                  </CardContent>
                </Card>
              </ScrollAnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8">
            <PricingPlan
              title="Free Plan"
              price="$0/month"
              features={[
                "5 AI-powered mock interviews per month",
                "Basic performance tracking",
                "Limited question database"
              ]}
              buttonText="Get Started"
            />
            <PricingPlan
              title="Premium Plan"
              price="$10/month"
              features={[
                "Unlimited AI-powered mock interviews",
                "Advanced performance analytics",
                "Full access to industry-specific questions",
                "Priority customer support"
              ]}
              buttonText="Upgrade Now"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#222222] ">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <ContinuousCarousel items={testimonials} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold">Ready to Ace Your Next Interview?</h2>
          <p className="mb-8 text-lg sm:text-xl text-gray-300">
            Start practicing with our AI-powered platform today and boost your confidence.
          </p>
          <Link href="/interview" passHref>
            <Button className="bg-[#FCD19C] hover:bg-[#f8c27e] text-[#2A2A2A] font-bold py-3 px-6 rounded-md text-lg">
              Start a Mock Interview
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, Eye, TrendingUp, CreditCard, Activity, Download, UserPlus } from "lucide-react"

const metrics = [
  {
    title: "Today's Money",
    value: "$53k",
    change: "+55% than last week",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Today's Users",
    value: "2300",
    change: "+3% than last month",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Ads Views",
    value: "3,462",
    change: "-2% than yesterday",
    changeType: "negative",
    icon: Eye,
  },
  {
    title: "Sales",
    value: "$103,430",
    change: "+5% than yesterday",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    title: "Total Orders",
    value: "1,235",
    change: "+12% than last week",
    changeType: "positive",
    icon: CreditCard,
  },
  {
    title: "Bounce Rate",
    value: "2.49%",
    change: "-0.5% than yesterday",
    changeType: "positive",
    icon: Activity,
  },
  {
    title: "Downloads",
    value: "8,642",
    change: "+18% than last month",
    changeType: "positive",
    icon: Download,
  },
  {
    title: "New Users",
    value: "892",
    change: "+8% than yesterday",
    changeType: "positive",
    icon: UserPlus,
  },
]

export default function DashboardCards() {

  return (
    <div >
      {/* <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="mb-6">View Dashboard Metrics</Button>
        </SheetTrigger>
        <SheetContent side="top" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Dashboard Overview</SheetTitle>
          </SheetHeader>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <Card key={index} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                      </div>
                      <div className="rounded-lg bg-gray-900 p-3">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 relative">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                      <p className={`text-xs ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </SheetContent>
      </Sheet> */}

      {/* Preview cards outside sheet */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden">
        {metrics.slice(0, 4).map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className="rounded-lg bg-gray-900 p-3">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-4 pt-4 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <p className={`text-xs ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                    {metric.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

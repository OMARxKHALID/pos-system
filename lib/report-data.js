export const reportMetrics = {
  totalSales: {
    current: 12650.0,
    change: 1543.3,
    percentage: 12.2,
    trend: "up",
  },
  totalProducts: {
    current: 1250,
    change: 125,
    percentage: 10,
    trend: "up",
  },
  totalCustomers: {
    current: 400,
    change: -5,
    percentage: 0.02,
    trend: "down",
  },
  netProfit: {
    current: 12650.0,
    change: 3792,
    percentage: 0.3,
    trend: "up",
  },
}

export const favoriteProducts = [
  {
    id: 1,
    name: "Buttermelt Croissant",
    category: "Pastry",
    image: "/placeholder.svg?height=40&width=40",
    orders: 183,
  },
  {
    id: 2,
    name: "Beef Crowich",
    category: "Sandwich",
    image: "/placeholder.svg?height=40&width=40",
    orders: 160,
  },
  {
    id: 3,
    name: "Sliced Blackforest",
    category: "Cake",
    image: "/placeholder.svg?height=40&width=40",
    orders: 125,
  },
  {
    id: 4,
    name: "Solo Floss Bread",
    category: "Bread",
    image: "/placeholder.svg?height=40&width=40",
    orders: 119,
  },
]

export const allOrders = [
  {
    id: "001",
    date: "25/05/2024",
    time: "08:00 AM",
    customerName: "George",
    orderStatus: "Done",
    totalPayment: 35.0,
    paymentStatus: "Paid",
  },
  {
    id: "002",
    date: "25/05/2024",
    time: "09:15 AM",
    customerName: "Sarah",
    orderStatus: "Done",
    totalPayment: 42.5,
    paymentStatus: "Paid",
  },
  {
    id: "003",
    date: "26/05/2024",
    time: "10:30 AM",
    customerName: "Mike",
    orderStatus: "Processing",
    totalPayment: 28.75,
    paymentStatus: "Pending",
  },
]

export const chartData = [
  { month: "Jan", amount: 8500 },
  { month: "Feb", amount: 9200 },
  { month: "Mar", amount: 10100 },
  { month: "Apr", amount: 11800 },
  { month: "May", amount: 12650 },
  { month: "Jun", amount: 11200 },
]

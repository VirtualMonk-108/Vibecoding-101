'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Zap, 
  Cloud, 
  Car,
  CreditCard,
  Star,
  Ticket
} from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const featuredEvents = [
    {
      id: 1,
      title: 'Cape Town Jazz Festival 2024',
      date: '2024-03-30',
      location: 'Cape Town International Convention Centre',
      attendees: 1250,
      price: 'From R450',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      tags: ['Music', 'Jazz', 'Festival'],
      loadSheddingBackup: true,
      weatherReady: true
    },
    {
      id: 2,
      title: 'Johannesburg Tech Summit',
      date: '2024-04-15',
      location: 'Sandton Convention Centre',
      attendees: 800,
      price: 'From R850',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      tags: ['Technology', 'Business', 'Networking'],
      loadSheddingBackup: true,
      weatherReady: false
    },
    {
      id: 3,
      title: 'Durban Food & Wine Festival',
      date: '2024-05-12',
      location: 'Moses Mabhida Stadium',
      attendees: 2100,
      price: 'From R320',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      tags: ['Food', 'Wine', 'Culture'],
      loadSheddingBackup: true,
      weatherReady: true
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sa-green to-sa-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gradient">EventsZA</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground">Discover</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Categories</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">My Events</a>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm" className="bg-sa-green hover:bg-sa-green/90">Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-sa text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              🇿🇦 Discover South Africa's
              <br />
              <span className="text-sa-yellow">Best Events</span>
            </h1>
            <p className="text-xl mb-8 text-white/90 animate-slide-up">
              From Cape Town to Johannesburg - find events that work around load-shedding,
              weather, and transport. Built for Mzansi.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-3xl mx-auto animate-slide-up">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                  <Input 
                    placeholder="Search events..." 
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                  <Input 
                    placeholder="Location..." 
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <Button size="lg" className="bg-sa-yellow text-sa-black hover:bg-sa-yellow/90 font-semibold">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* South African Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Built for South Africa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-12 h-12 mx-auto text-sa-yellow mb-4" />
                <CardTitle>Load Shedding Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Events with backup power and schedule awareness</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CreditCard className="w-12 h-12 mx-auto text-sa-green mb-4" />
                <CardTitle>Local Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">PayFast, Ozow, SnapScan & EFT payments</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Car className="w-12 h-12 mx-auto text-sa-blue mb-4" />
                <CardTitle>Transport Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Uber, Bolt estimates and public transport info</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Cloud className="w-12 h-12 mx-auto text-sa-orange mb-4" />
                <CardTitle>Weather Aware</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Real-time weather updates and backup plans</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Button variant="outline">View All Events</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {event.loadSheddingBackup && (
                      <Badge className="bg-sa-yellow text-sa-black">
                        <Zap className="w-3 h-3 mr-1" />
                        Backup Power
                      </Badge>
                    )}
                    {event.weatherReady && (
                      <Badge className="bg-sa-blue text-white">
                        <Cloud className="w-3 h-3 mr-1" />
                        Weather Ready
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sa-green">{event.price}</div>
                    <Button size="sm" className="bg-sa-green hover:bg-sa-green/90">
                      <Ticket className="w-4 h-4 mr-2" />
                      Get Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sa-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore South African Events?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of event-goers discovering amazing experiences across Mzansi.
            From braais to business conferences - we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-sa-green hover:bg-gray-100">
              Sign Up Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sa-green">
              Browse Events
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-sa-green to-sa-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">EventsZA</span>
              </div>
              <p className="text-gray-400">
                South Africa's premier event discovery and booking platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Discover Events</a></li>
                <li><a href="#" className="hover:text-white">Create Events</a></li>
                <li><a href="#" className="hover:text-white">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Safety</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">South African Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>🔌 Load Shedding Ready</li>
                <li>💳 Local Payment Methods</li>
                <li>🌍 Multi-Language Support</li>
                <li>🚗 Transport Integration</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EventsZA. Built with ❤️ for South Africa. 🇿🇦</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
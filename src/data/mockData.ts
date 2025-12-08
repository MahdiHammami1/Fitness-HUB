import { CoachingOffer, Event, Product, Testimonial } from '@/types';

export const coachingOffers: CoachingOffer[] = [
  {
    id: '1',
    title: '1:1 Personal Coaching',
    description: 'Exclusive one-on-one training tailored to your goals. Get personalized workout plans, nutrition guidance, and weekly check-ins.',
    price: 299,
    duration: 'per month',
    features: [
      'Personalized training program',
      'Custom nutrition plan',
      'Weekly video calls',
      '24/7 WhatsApp support',
      'Form check & technique review',
      'Progress tracking dashboard'
    ],
    isActive: true,
    popular: true
  },
  {
    id: '2',
    title: 'Group Coaching',
    description: 'Train with a motivated community. Perfect for those who thrive in a group setting with structured programming.',
    price: 99,
    duration: 'per month',
    features: [
      'Group training program',
      'Weekly group calls',
      'Private community access',
      'Monthly challenges',
      'Nutrition guidelines'
    ],
    isActive: true
  },
  {
    id: '3',
    title: 'Online Program',
    description: 'Self-paced 12-week transformation program with video tutorials and meal plans. Perfect for independent athletes.',
    price: 149,
    duration: 'one-time',
    features: [
      '12-week structured program',
      '50+ video tutorials',
      'Complete meal plan',
      'Exercise library access',
      'Progress tracking sheets'
    ],
    isActive: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmed K.',
    text: 'Coach Yassine completely transformed my approach to fitness. Lost 15kg in 4 months and gained strength I never thought possible. His attention to detail and constant support made all the difference.',
    rating: 5,
    consent: true,
    approved: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Sarah M.',
    text: 'The group coaching program is incredible. The community keeps me accountable and the workouts are challenging but achievable. Best investment in my health!',
    rating: 5,
    consent: true,
    approved: true,
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Karim B.',
    text: 'From someone who never stepped into a gym to completing my first competition - all thanks to Coach Yassine. The personalized approach and constant motivation changed my life.',
    rating: 5,
    consent: true,
    approved: true,
    createdAt: new Date('2024-03-10')
  }
];

export const events: Event[] = [
  {
    id: '1',
    title: 'HIIT & Burn Workshop',
    description: 'Intense 2-hour workshop focusing on High-Intensity Interval Training. Learn proper form, technique, and take home a complete HIIT program. All fitness levels welcome.',
    startAt: new Date('2025-01-15T09:00:00'),
    location: 'Wouhouch Gym, Casablanca',
    capacity: 30,
    currentRegistrations: 18,
    price: 0,
    isFree: true,
    coverImage: '/events/hiit-workshop.jpg',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Strength Fundamentals Seminar',
    description: 'Master the big 3 lifts: Squat, Bench Press, and Deadlift. This comprehensive seminar covers technique, programming, and injury prevention.',
    startAt: new Date('2025-01-22T14:00:00'),
    location: 'Wouhouch Gym, Casablanca',
    capacity: 20,
    currentRegistrations: 15,
    price: 50,
    isFree: false,
    coverImage: '/events/strength-seminar.jpg',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Nutrition Masterclass',
    description: 'Understanding macros, meal timing, and supplementation. Learn how to fuel your body for performance and recovery.',
    startAt: new Date('2025-02-05T10:00:00'),
    location: 'Online - Zoom',
    capacity: 100,
    currentRegistrations: 42,
    price: 25,
    isFree: false,
    coverImage: '/events/nutrition-class.jpg',
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Beach Bootcamp 2024',
    description: 'Our annual beach workout event brought together 50+ athletes for an unforgettable morning of fitness.',
    startAt: new Date('2024-08-15T07:00:00'),
    location: 'Ain Diab Beach, Casablanca',
    capacity: 50,
    currentRegistrations: 50,
    price: 0,
    isFree: true,
    coverImage: '/events/beach-bootcamp.jpg',
    status: 'past'
  }
];

export const products: Product[] = [
  // Supplements & Gear
  {
    id: '1',
    title: 'Wouhouch Whey Protein',
    description: 'Premium whey protein isolate for maximum muscle recovery. 25g protein per serving with minimal carbs and fats.',
    price: 450,
    collection: 'SUPPLEMENTS_GEAR',
    images: ['/products/whey-protein.jpg'],
    stock: 50,
    isActive: true,
    variants: [
      { id: 'v1', productId: '1', variantType: 'flavor', value: 'Chocolate', stock: 20 },
      { id: 'v2', productId: '1', variantType: 'flavor', value: 'Vanilla', stock: 15 },
      { id: 'v3', productId: '1', variantType: 'flavor', value: 'Strawberry', stock: 15 }
    ],
    ingredients: 'Whey Protein Isolate, Cocoa Powder, Natural Flavoring, Stevia',
    usage: 'Mix 1 scoop (30g) with 250ml water or milk. Consume within 30 minutes post-workout.',
    warnings: 'Contains milk. Store in a cool, dry place.'
  },
  {
    id: '2',
    title: 'Creatine Monohydrate',
    description: 'Pure micronized creatine monohydrate for increased strength and power output.',
    price: 180,
    collection: 'SUPPLEMENTS_GEAR',
    images: ['/products/creatine.jpg'],
    stock: 75,
    isActive: true,
    ingredients: '100% Creatine Monohydrate',
    usage: 'Take 5g daily with water. Can be mixed with protein shake.',
    warnings: 'Consult physician before use. Drink adequate water.'
  },
  {
    id: '3',
    title: 'Pre-Workout Ignite',
    description: 'Explosive energy formula with caffeine, beta-alanine, and citrulline for intense workouts.',
    price: 320,
    collection: 'SUPPLEMENTS_GEAR',
    images: ['/products/pre-workout.jpg'],
    stock: 40,
    isActive: true,
    variants: [
      { id: 'v4', productId: '3', variantType: 'flavor', value: 'Fruit Punch', stock: 20 },
      { id: 'v5', productId: '3', variantType: 'flavor', value: 'Blue Raspberry', stock: 20 }
    ],
    ingredients: 'Caffeine 200mg, Beta-Alanine, L-Citrulline, Taurine',
    usage: 'Mix 1 scoop with 300ml water 20-30 minutes before training.',
    warnings: 'High caffeine content. Not for persons under 18.'
  },
  {
    id: '4',
    title: 'Wouhouch Shaker Bottle',
    description: 'Premium 700ml shaker with leak-proof design and mixing ball.',
    price: 85,
    collection: 'SUPPLEMENTS_GEAR',
    images: ['/products/shaker.jpg'],
    stock: 100,
    isActive: true
  },
  {
    id: '5',
    title: 'Resistance Bands Set',
    description: 'Complete set of 5 resistance bands for warm-ups, mobility, and home workouts.',
    price: 150,
    collection: 'SUPPLEMENTS_GEAR',
    images: ['/products/bands.jpg'],
    stock: 60,
    isActive: true
  },
  // Apparel
  {
    id: '6',
    title: 'Wouhouch Classic Tee',
    description: 'Premium cotton blend t-shirt with iconic Wouhouch logo. Comfortable fit for training or casual wear.',
    price: 199,
    collection: 'APPAREL',
    images: ['/products/classic-tee.jpg'],
    stock: 80,
    isActive: true,
    variants: [
      { id: 'v6', productId: '6', variantType: 'size', value: 'S', stock: 20 },
      { id: 'v7', productId: '6', variantType: 'size', value: 'M', stock: 20 },
      { id: 'v8', productId: '6', variantType: 'size', value: 'L', stock: 20 },
      { id: 'v9', productId: '6', variantType: 'size', value: 'XL', stock: 20 }
    ]
  },
  {
    id: '7',
    title: 'Performance Tee',
    description: 'Moisture-wicking athletic tee designed for intense training. Lightweight and breathable.',
    price: 249,
    collection: 'APPAREL',
    images: ['/products/performance-tee.jpg'],
    stock: 60,
    isActive: true,
    variants: [
      { id: 'v10', productId: '7', variantType: 'size', value: 'S', stock: 15 },
      { id: 'v11', productId: '7', variantType: 'size', value: 'M', stock: 15 },
      { id: 'v12', productId: '7', variantType: 'size', value: 'L', stock: 15 },
      { id: 'v13', productId: '7', variantType: 'size', value: 'XL', stock: 15 }
    ]
  },
  {
    id: '8',
    title: 'Limited Edition Hoodie',
    description: 'Premium heavyweight hoodie with embroidered Wouhouch logo. Perfect for post-workout.',
    price: 399,
    collection: 'APPAREL',
    images: ['/products/hoodie.jpg'],
    stock: 30,
    isActive: true,
    variants: [
      { id: 'v14', productId: '8', variantType: 'size', value: 'S', stock: 7 },
      { id: 'v15', productId: '8', variantType: 'size', value: 'M', stock: 8 },
      { id: 'v16', productId: '8', variantType: 'size', value: 'L', stock: 8 },
      { id: 'v17', productId: '8', variantType: 'size', value: 'XL', stock: 7 }
    ]
  }
];

export const coachProfile = {
  name: 'Yassine Saidani',
  title: 'Head Coach & Founder',
  bio: `With over 10 years of experience in fitness and strength training, I've dedicated my life to helping others unlock their full potential. My journey started in competitive bodybuilding and evolved into a passion for coaching and transforming lives.

At Wouhouch Hub, we believe that fitness is not just about building muscle – it's about building character, discipline, and a lifestyle that empowers you to be the best version of yourself.`,
  philosophy: 'Train hard. Eat clean. Stay consistent. Results will follow.',
  certifications: [
    'ISSA Certified Personal Trainer',
    'Precision Nutrition Level 1',
    'NSCA Strength & Conditioning Specialist',
    'First Aid & CPR Certified'
  ],
  stats: {
    clientsTransformed: '500+',
    yearsExperience: '10+',
    eventsHosted: '50+',
    satisfactionRate: '98%'
  }
};

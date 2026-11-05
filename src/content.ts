// Update these values with the studio's real details before publishing.
export const studio = {
  name: 'Twist & Bloom',
  email: '',
  whatsapp: '', // International digits only, without a plus sign.
  instagram: '', // Full Instagram profile URL.
}

export type Creation = {
  id: string
  name: string
  category: 'Flowers' | 'Flowerpots' | 'Fridge magnets' | 'Little joys'
  description: string
  story: string
  color: string
  image: string
}

export const creations: Creation[] = [
  {
    id: 'bouquet', name: 'The forever bouquet', category: 'Flowers',
    description: 'A bunch of happiness. No watering needed.',
    story: 'Soft petals, cheerful colours, and a little handmade character in every stem. A bouquet to brighten a desk, a bedside table, or someone’s entire day. Tell us the colours you love and we’ll explore your own version together.',
    color: 'pink', image: '/images/bouquet.webp',
  },
  {
    id: 'flowerpot', name: 'Happiness, potted', category: 'Flowerpots',
    description: 'A happy little corner. No green thumb needed.',
    story: 'A little flowerpot, full of handmade happiness. From the fuzzy pot to the flowers peeking out of it, pipe cleaners turn a familiar everyday object into something wonderfully playful. Tell us the colours you’d love for your desk, shelf, or favourite corner.',
    color: 'yellow', image: '/images/flowerpot.webp',
  },
  {
    id: 'magnet', name: 'Fridge-side flowers', category: 'Fridge magnets',
    description: 'A tiny flowerpot for your everyday gallery.',
    story: 'Our flowerpots have a tiny side, too. A pipe-cleaner flowerpot fridge magnet brings a little bloom to the place you leave notes, favourite photos, and everyday reminders. Share a colour or gifting idea to explore a little magnet of your own.',
    color: 'green', image: '/images/magnet.webp',
  },
  {
    id: 'daisies', name: 'Pocketful of sunshine', category: 'Flowers',
    description: 'Small daisies. Instant good mood.',
    story: 'A little cluster of daisies with sunny centres and wonderfully soft petals. A reminder that the smallest things can make a room feel happier. Use this creation as a starting point for your own handmade idea.',
    color: 'yellow', image: '/images/daisies.webp',
  },
  {
    id: 'bunny', name: 'Your little desk buddy', category: 'Little joys',
    description: 'A tiny friend with a big personality.',
    story: 'Meet a little bunny made from twists, loops, and a whole lot of imagination. A friendly companion for a favourite corner. Ask us about a character, colour, or tiny detail that would make your creation feel like you.',
    color: 'lavender', image: '/images/bunny.webp',
  },
  {
    id: 'tulips', name: 'Tulips, with a twist', category: 'Flowers',
    description: 'For the person who makes life colourful.',
    story: 'A playful take on a flower-shop favourite. Sculpted pipe-cleaner petals make these tulips soft, bright, and full of texture. Share your favourite shades to start a conversation about your own bunch.',
    color: 'green', image: '/images/tulips.webp',
  },
]

export const faqs = [
  { question: 'What are your creations made from?', answer: 'Pipe cleaners! We bend, loop, and shape these soft, fuzzy stems by hand to create flowers, flowerpots, flowerpot fridge magnets, and other cheerful things. Each piece has its own handmade personality.' },
  { question: 'Can I ask for something in my favourite colours?', answer: 'Yes—start an enquiry and tell us what you have in mind. Share the colours, occasion, or idea you’re thinking of, and we can discuss what’s possible before confirming an order.' },
  { question: 'Do I need experience to join a workshop?', answer: 'You can enquire whether you’re completely new to crafting or already love making things. Tell us who’s joining so we can discuss a workshop that suits your group.' },
  { question: 'How do I find out about prices or workshops?', answer: 'Use “Let’s talk” to put together a product or workshop enquiry. Prices, availability, workshop dates, and location are confirmed directly with the studio before you book or buy.' },
]

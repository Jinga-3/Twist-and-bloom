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
  category: 'Flowers' | 'Flowerpots' | 'Fridge magnets' | 'Keychains' | 'Hair clips' | 'Little joys'
  description: string
  story: string
  color: string
  image: string
  imageAlt: string
  video?: string
}

// Keep the supplied files intact; the browser handles spaces in these local URLs.
const photo = (time: string) => `/images/WhatsApp Image 2026-11-07 at ${time}.jpeg`
const video = (time: string) => `/images/WhatsApp Video 2026-11-07 at ${time}.mp4`

export const studioMedia = {
  story: photo('3.56.22 PM'),
  workshop: photo('3.56.21 PM'),
}

export const creations: Creation[] = [
  {
    id: 'flowerpot', name: 'Happiness, potted', category: 'Flowerpots',
    description: 'Sky-blue daisies. A happy little corner.',
    story: 'Two sky-blue daisies with sunny yellow centres, tucked into a little brown pipe-cleaner pot. Soft loops, green leaves, and a little handmade character in every petal. Tell us the colours you would love for your own happy corner.',
    color: 'yellow', image: photo('3.56.21 PM'),
    imageAlt: 'A hand holding two blue pipe-cleaner daisies with yellow centres in a brown pot',
    video: video('3.56.35 PM'),
  },
  {
    id: 'sunflower-pot', name: 'A pot of sunshine', category: 'Flowerpots',
    description: 'One golden sunflower. Plenty of cheer.',
    story: 'Golden petals curl around a warm brown centre, with a green stem and a small handmade pot beneath. A cheerful little sunflower for a desk, shelf, or thoughtful gift. Share your idea with us to explore a piece of your own.',
    color: 'yellow', image: photo('3.56.24 PM'),
    imageAlt: 'A handmade yellow pipe-cleaner sunflower in a small brown pot, held in one hand',
    video: video('3.56.38 PM'),
  },
  {
    id: 'sunflower-hair-clips', name: 'Sunshine in your hair', category: 'Hair clips',
    description: 'A pair of sunflowers for happy hair days.',
    story: 'Two little yellow sunflowers with soft brown centres and green stems, made into a cheerful pair of hair clips. A little handmade colour to tuck into your day. Share your favourite shades to explore a pair of your own.',
    color: 'yellow', image: '/images/sunflower-hair-clips.webp',
    imageAlt: 'A hand holding a pair of yellow pipe-cleaner sunflower hair clips with green stems',
    video: video('3.56.32 PM'),
  },
  {
    id: 'cherry-keychain', name: 'The cherry on top', category: 'Keychains',
    description: 'A tiny pair of cherries to take along.',
    story: 'Two bright red cherries hang from a green looped stem and a silver keyring. A playful pipe-cleaner detail for your keys or favourite bag. Tell us who you have in mind and we can explore a little handmade gift together.',
    color: 'pink', image: photo('3.56.24 PM (2)'),
    imageAlt: 'Two red pipe-cleaner cherries with a green bow-shaped stem on a silver keyring',
    video: video('3.56.38 PM (1)'),
  },
  {
    id: 'keychain', name: 'The little bloom keychain', category: 'Keychains',
    description: 'A little sunflower to take everywhere.',
    story: 'A golden pipe-cleaner sunflower with a dark centre, hanging from a silver keyring. A small handmade detail to brighten your keys or favourite bag. Share your favourite colours to explore a keychain that feels like you.',
    color: 'yellow', image: photo('3.56.32 PM (1)'),
    imageAlt: 'A yellow pipe-cleaner sunflower with a dark brown centre on a silver keychain',
    video: video('3.56.39 PM (1)'),
  },
  {
    id: 'blush-daisy-pot', name: 'A little blush', category: 'Flowerpots',
    description: 'Soft pink daisies, made to stay.',
    story: 'Pale pink petals, warm brown centres, and a little pot made from fuzzy stems. These two daisies bring a gentle touch of colour to an everyday corner. Start an enquiry to talk about your own colours and details.',
    color: 'pink', image: photo('3.56.22 PM'),
    imageAlt: 'Two pale pink pipe-cleaner daisies in a brown handmade pot held against a light wall',
    video: video('3.56.34 PM'),
  },
  {
    id: 'red-daisy-pot', name: 'A bright little hello', category: 'Flowerpots',
    description: 'Red petals and sunny little centres.',
    story: 'A pair of bright red daisies rise from a dark brown pipe-cleaner pot. Yellow centres and deep green stems make every soft petal stand out. A colourful starting point for a handmade gift of your own.',
    color: 'green', image: photo('3.56.21 PM (1)'),
    imageAlt: 'Two red pipe-cleaner daisies with yellow centres in a dark brown pot',
    video: video('3.56.36 PM'),
  },
  {
    id: 'pink-bloom-keychain', name: 'Two little pink blooms', category: 'Keychains',
    description: 'A tiny bunch for your favourite bag.',
    story: 'Two small pink flowers hang from a green bow-shaped stem on a silver keyring. Soft, simple, and full of handmade character. Share your colour or gifting idea to explore a little bunch of your own.',
    color: 'pink', image: photo('3.56.32 PM'),
    imageAlt: 'Two small pink pipe-cleaner flowers with green stems attached to a silver keyring',
    video: video('3.56.39 PM'),
  },
  {
    id: 'red-bloom-keychain', name: 'A pocketful of petals', category: 'Keychains',
    description: 'Bright red blooms, ready to go.',
    story: 'A little bunch of red looped petals, gathered with green stems and attached to a silver keyring. A flower-inspired keepsake that goes wherever you do. Tell us the colours you love to start a conversation.',
    color: 'green', image: photo('3.56.28 PM'),
    imageAlt: 'A small bunch of red pipe-cleaner flowers tied with green stems on a silver keyring',
    video: video('3.56.38 PM (2)'),
  },
  {
    id: 'blue-daisy-pot', name: 'One happy daisy', category: 'Flowerpots',
    description: 'A blue bloom with a sunny heart.',
    story: 'One sky-blue daisy, a yellow centre, and a dark brown fuzzy pot. A little reminder that a single flower can bring plenty of colour. Ask us about making something personal for your desk or favourite corner.',
    color: 'yellow', image: photo('3.56.24 PM (1)'),
    imageAlt: 'A single blue pipe-cleaner daisy with a yellow centre in a dark brown pot',
    video: video('3.56.37 PM (1)'),
  },
  {
    id: 'pink-daisy-pot', name: 'Pretty in pink', category: 'Flowerpots',
    description: 'Two pink daisies. Twice the joy.',
    story: 'Bright pink petals frame two dark centres above a warm brown pipe-cleaner pot. Every loop adds a little texture and personality. Share your favourite shades to explore a handmade piece of your own.',
    color: 'lavender', image: photo('3.56.22 PM (1)'),
    imageAlt: 'Two bright pink pipe-cleaner daisies with dark centres in a brown pot',
    video: video('3.56.37 PM'),
  },
]

export const faqs = [
  { question: 'What are your creations made from?', answer: 'Pipe cleaners! We bend, loop, and shape these soft, fuzzy stems by hand to create flowers, flowerpots, flowerpot fridge magnets, keychains, hair clips, and other cheerful things. Each piece has its own handmade personality.' },
  { question: 'Can I ask for something in my favourite colours?', answer: 'Yes—start an enquiry and tell us what you have in mind. Share the colours, occasion, or idea you’re thinking of, and we can discuss what’s possible before confirming an order.' },
  { question: 'Do I need experience to join a workshop?', answer: 'You can enquire whether you’re completely new to crafting or already love making things. Tell us who’s joining so we can discuss a workshop that suits your group.' },
  { question: 'How do I find out about prices or workshops?', answer: 'Use “Let’s talk” to put together a product or workshop enquiry. Prices, availability, workshop dates, and location are confirmed directly with the studio before you book or buy.' },
]

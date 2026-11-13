// In-memory sample data for the Design Blog API (see endpoint.md)
// Data is generated deterministically (no randomness), so it is the same on every run.
// Change the counts below to make the dataset bigger or smaller.

const POST_COUNT = 60
const COMMENTS_PER_POST = 4 // average; varies by post id
const USER_COUNT = 30

const authors = [
    "Sokha", "Dara", "Vanna", "Chantha", "Rithy", "Sreyneang", "Pisey",
    "Bopha", "Kosal", "Maly", "Sophea", "Vibol", "Channary", "Sambath", "Leakhena",
]

export const categories = [
    { id: 1, name: "UI Design", slug: "ui-design" },
    { id: 2, name: "UX Research", slug: "ux-research" },
    { id: 3, name: "Branding", slug: "branding" },
    { id: 4, name: "Typography", slug: "typography" },
    { id: 5, name: "Color Theory", slug: "color-theory" },
    { id: 6, name: "Illustration", slug: "illustration" },
    { id: 7, name: "Motion Design", slug: "motion-design" },
    { id: 8, name: "Design Systems", slug: "design-systems" },
    { id: 9, name: "Accessibility", slug: "accessibility" },
    { id: 10, name: "Web Design", slug: "web-design" },
]

// Titles per category (index = categoryId - 1)
const topics = [
    ["Principles of Good UI Design", "Designing Better Buttons", "Mastering Spacing and Layout", "Dark Mode Done Right", "Microinteractions That Delight", "Designing Forms People Finish"],
    ["How to Run a User Interview", "Usability Testing on a Budget", "Writing Good Survey Questions", "Building User Personas", "Journey Mapping Basics", "Card Sorting Explained"],
    ["Building a Brand Identity from Scratch", "Logo Design Mistakes to Avoid", "Defining Your Brand Voice", "Brand Guidelines That Teams Use", "Rebranding Without Losing Your Audience", "Choosing a Brand Name"],
    ["Choosing the Right Typeface", "Pairing Fonts Like a Pro", "Understanding Line Height", "Variable Fonts in Practice", "Serif vs Sans-Serif", "Type Scales Explained"],
    ["Color Theory for Beginners", "Building Accessible Palettes", "Psychology of Color", "Gradients That Look Good", "Using Color to Guide Attention", "Neutral Colors Matter"],
    ["Getting Started with Digital Illustration", "Flat vs Isometric Illustration", "Creating Custom Icons", "Drawing Characters for Brands", "Illustration Styles in 2026", "Texture and Grain in Design"],
    ["Principles of Animation for UI", "Easing Curves Explained", "Designing Loading States", "Lottie vs CSS Animation", "Page Transitions That Feel Natural", "Motion and Accessibility"],
    ["Starting a Design System", "Design Tokens Explained", "Documenting Components", "Versioning a Design System", "Scaling Design Across Teams", "Naming Conventions for Components"],
    ["Accessibility Basics for Designers", "Contrast Ratios Explained", "Designing for Screen Readers", "Keyboard Navigation Patterns", "Inclusive Design Principles", "Accessible Forms and Errors"],
    ["Responsive Design Patterns", "Designing a Landing Page That Converts", "Grid Systems in CSS", "Performance and Design", "Navigation Patterns for the Web", "Designing Pricing Pages"],
]

const sentences = [
    "Good design starts with understanding the people who will use it.",
    "Small details add up to a polished experience.",
    "Consistency builds trust and reduces the learning curve.",
    "Always test your assumptions with real users.",
    "Constraints often lead to more creative solutions.",
    "Clarity should always win over cleverness.",
    "Iterate quickly, gather feedback, and refine.",
    "White space is not wasted space; it gives content room to breathe.",
    "Hierarchy guides the eye and communicates importance.",
    "Great products balance aesthetics with usability.",
]

const commentTexts = [
    "Great article, thanks for sharing!",
    "This really helped me with my current project.",
    "Would love to see more examples.",
    "I disagree a little, but I see your point.",
    "Bookmarked for later. Very useful.",
    "Can you write a follow-up on this topic?",
    "Clear and easy to follow.",
    "I tried this and it worked well for me.",
    "Interesting take, never thought about it that way.",
    "Thanks! Sharing this with my team.",
    "Any recommended tools for this?",
    "This is exactly what I was looking for.",
]

// Build an ISO date: day offset from 2026-01-01 plus hour offset
const makeDate = (dayOffset, hour = 9) =>
    new Date(Date.UTC(2026, 0, 1 + dayOffset, hour, (dayOffset * 7) % 60)).toISOString()

export const posts = Array.from({ length: POST_COUNT }, (_, i) => {
    const id = i + 1
    const categoryId = (i % categories.length) + 1
    const titleList = topics[categoryId - 1]
    const title = titleList[Math.floor(i / categories.length) % titleList.length]
    const createdDay = i * 5 // a post roughly every 5 days
    const created = makeDate(createdDay, 8 + (i % 10))
    // every 3rd post was edited later
    const updated = id % 3 === 0 ? makeDate(createdDay + 2, 15) : created

    return {
        id,
        title,
        content: [0, 1, 2].map((n) => sentences[(i + n * 3) % sentences.length]).join(" "),
        author: authors[i % authors.length],
        categoryId,
        createdAt: created,
        updatedAt: updated,
    }
})

export const comments = []
posts.forEach((post) => {
    // 0..(2*COMMENTS_PER_POST - 1) comments, varying per post
    const count = (post.id * 3) % (COMMENTS_PER_POST * 2)
    for (let n = 0; n < count; n++) {
        const id = comments.length + 1
        comments.push({
            id,
            postId: post.id,
            author: authors[(post.id + n + 1) % authors.length],
            content: commentTexts[(post.id + n) % commentTexts.length],
            createdAt: makeDate(post.id * 5 + n + 1, 10 + (n % 12)),
        })
    }
})

// One row per like. userId prevents the same user liking a post twice.
export const likes = []
posts.forEach((post) => {
    const count = (post.id * 5) % USER_COUNT
    for (let n = 0; n < count; n++) {
        likes.push({
            id: likes.length + 1,
            postId: post.id,
            userId: 101 + ((post.id + n * 7) % USER_COUNT),
        })
    }
})

export default { categories, posts, comments, likes }

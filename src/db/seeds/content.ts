import { db } from '@/db';
import { content } from '@/db/schema';

async function main() {
    const sampleContent = [
        {
            section: 'hero',
            title: 'Experience Authentic Indian Cuisine',
            description: 'Welcome to SIRI, where traditional Indian flavors meet modern culinary artistry. Immerse yourself in a dining experience that celebrates the rich heritage and vibrant tastes of India.',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            section: 'about',
            title: 'Our Story',
            description: 'SIRI was born from a passion to bring authentic Indian cuisine to food lovers everywhere. Our chefs blend time-honored recipes with contemporary techniques, creating dishes that honor tradition while embracing innovation. Every ingredient is carefully selected, every spice perfectly balanced, to deliver an unforgettable culinary journey.',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            section: 'experience',
            title: 'A Feast for the Senses',
            description: 'Step into our elegant space where warm hospitality meets exquisite design. From the aromatic spices that greet you at the door to the artfully plated dishes that arrive at your table, every detail is crafted to transport you to the heart of India. Whether you\'re celebrating a special occasion or enjoying a casual dinner, SIRI promises an experience you\'ll cherish.',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            section: 'cta',
            title: 'Reserve Your Table Today',
            description: 'Join us for an extraordinary dining experience. Book your table now and discover why SIRI is the destination for authentic Indian cuisine.',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(content).values(sampleContent);
    
    console.log('✅ Content seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
import React from 'react';
import { MenuCategory } from '../types';

interface CategoryNavProps {
    categories: MenuCategory[];
    activeCategory: MenuCategory;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, activeCategory }) => {

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href')?.substring(1);
        if (!targetId) return;

        const section = document.getElementById(targetId);
        if (section) {
            // The 'start' block alignment works with the `scroll-mt-32` on the section
            // to ensure the title is not obscured by the sticky header.
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="sticky top-16 bg-white z-30 border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 sm:space-x-8 -mb-px overflow-x-auto">
                    {categories.map(category => (
                        <a
                            key={category}
                            href={`#${category}`}
                            onClick={handleClick}
                            className={`py-4 px-1 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                                activeCategory === category
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {category}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default CategoryNav;

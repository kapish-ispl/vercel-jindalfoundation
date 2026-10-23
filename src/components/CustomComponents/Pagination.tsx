'use client';

import React from 'react';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface PaginationProps {
    totalPosts: number;
    itemsPerPage: number;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ totalPosts, itemsPerPage, className }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const pageCount = Math.ceil(totalPosts / itemsPerPage);
    const currentPage = Number(searchParams.get('page') || 1);

    if (totalPosts <= itemsPerPage) return null;

    const handlePageClick = ({ selected }: { selected: number }) => {
        const newParams = new URLSearchParams(searchParams?.toString() || '');
        newParams.set('page', `${selected + 1}`);
        const newUrl = `${pathname}?${newParams.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    return (
        <div className={`pagination-container my-4 d-flex justify-content-center${className ? ` ${className}` : ''}`}>
            <ReactPaginate
                previousLabel={
                    <span aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                }
                nextLabel={
                    <span aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                }
                breakLabel="..."
                breakClassName="break-me"
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName="pagination"
                pageClassName="pages"
                activeClassName="active"
                forcePage={currentPage - 1}
            />
        </div>
    );
};

export default Pagination;

export const SideBar = [
    {
        text: 'Quản lý quảng cáo',
        link: 'advertises',
        subItems: [

            {
                text: 'Quản lý quảng cáo',
                link: 'advertises',
            },
            {
                text: 'Danh mục quảng cáo',
                link: 'advertises/category',
            },
        ]
    },
    {
        text: 'Quản lý Tour',
        link: 'tours',
        subItems: [
            {
                text: 'Quản lý Tour',
                link: 'tours',
            },
            {
                text: 'Danh mục tour',
                link: 'tours/category',
            },
        ]
    },
    {
        text: 'Quản lý Transfer',
        link: 'transfers',
        subItems: [
            {
                text: 'Quản lý Transfer',
                link: 'transfers',
            },
            {
                text: 'Danh mục transfer',
                link: 'transfers/category',
            },
        ]
    },
    {
        text: 'Quản lý lịch trình',
        link: 'schedules',
        subItems: [
            {
                text: 'Quản lý lịch trình',
                link: 'schedules',
            }, {
                text: 'Danh mục lịch trình',
                link: 'schedules/category',
            },
        ]
    },
    {
        text: 'Quản lý Chỗ ở',
        link: 'accommodation',
        subItems: [
            {
                text: 'Danh mục',
                link: 'accommodations/category',
            },
            {
                text: 'Khách sạn',
                link: 'accommodations/hotel',
            },
            {
                text: 'Villa',
                link: 'accommodations/villa',
            },
            {
                text: 'Homestay',
                link: 'accommodations/homestay',
            }
        ]
    },
    {
        text: 'Quản lý yêu cầu khách hàng',
        link: 'customer-request',
        subItems: [
            {
                text: 'Quản lý bình luận',
                link: 'customer-request/comment',
            },
            {
                text: 'Quản lý yêu cầu xem phòng',
                link: 'customer-request/check-room',
            }
        ]
    },
    {
        text: 'Quản lý Entertain',
        link: 'entertains',
        subItems: [

            {
                text: 'Quản lý Entertain',
                link: 'entertains',
            },
            {
                text: 'Danh mục entertains',
                link: 'entertains/category',
            },
        ]
    },
    {
        text: 'Quản lý Nhà hàng',
        link: 'cuisine',
        subItems: [
            {
                text: 'Quản lý Nhà hàng',
                link: 'cuisine',
            }, {
                text: 'Danh mục nhà hàng',
                link: 'cuisine/category',
            },
        ]
    },
    {
        text: 'Quản lý reviews',
        link: 'reviews',
        subItems: [

            {
                text: 'Quản lý reviews',
                link: 'reviews',
            },
            {
                text: 'Danh mục reviews',
                link: 'reviews/category',
            }
        ],
        queryParams: { category: 'bannerTour' },
    },
    {
        text: 'Quản lý hình ảnh',
        link: 'images',
        queryParams: { category: 'image' },
    },
    {
        text: 'Quản lý user',
        link: 'users',
        queryParams: { category: 'bannerTour' },
    }
];

export const SideBar = [
    {
        text: 'Quản lý quảng cáo',
        apiPath: '/advertises',
        routeId: '',
        subItems: [

            {
                text: 'Quản lý quảng cáo',
                link: 'advertises',
            },
            {
                text: 'Danh mục quảng cáo',
                link: 'categories/advertise',
            },
        ]
    },
    {
        text: 'Quản lý Tour',
        apiPath: '/tours',
        routeId: '',
        subItems: [
            {
                text: 'Quản lý Tour',
                link: 'tours',
            },
            {
                text: 'Danh mục tour',
                link: 'categories/tour',
            },
        ]
    },
    {
        text: 'Quản lý Transfer',
        apiPath: '/transfers',
        routeId: '',
        subItems: [
            {
                text: 'Quản lý Transfer',
                link: 'transfers',
            },
            {
                text: 'Danh mục transfer',
                link: 'categories/transfer',
            },
        ]
    },
    {
        text: 'Quản lý lịch trình',
        apiPath: '/blogs',
        routeId: '',
        subItems: [
            {
                text: 'Quản lý lịch trình',
                link: 'schedules',
            }, {
                text: 'Danh mục lịch trình',
                link: 'categories/schedule',
            },
        ]
    },
    {
        text: 'Quản lý Chỗ ở',
        apiPath: '/estates',
        routeId: '',
        subItems: [
            {
                text: 'Danh mục',
                link: 'categories/accommodation',
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
        apiPath: '/customer-request',
        routeId: '',
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
        apiPath: '/entertains',
        routeId: '',
        subItems: [

            {
                text: 'Quản lý Entertain',
                link: 'entertains',
            },
            {
                text: 'Danh mục entertains',
                link: 'categories/entertain',
            },
        ]
    },
    {
        text: 'Quản lý Nhà hàng',
        apiPath: '/restaurants',
        routeId: '',
        subItems: [
            {
                text: 'Quản lý Nhà hàng',
                link: 'cuisine',
            }, {
                text: 'Danh mục nhà hàng',
                link: 'categories/cuisine',
            },
        ]
    },
    {
        text: 'Quản lý reviews',
        apiPath: '/user-reviews',
        routeId: '',
        subItems: [

            {
                text: 'Quản lý reviews',
                link: 'reviews',
            },
            {
                text: 'Danh mục reviews',
                link: 'categories/review',
            }
        ],
        queryParams: { category: 'bannerTour' },
    },
    {
        text: 'Quản lý hình ảnh',
        apiPath: '/images',
        routeId: '',
        queryParams: { category: 'image' },
    },
    {
        text: 'Quản lý user',
        apiPath: '/users',
        routeId: '',
        subItems: [
            {
                text: 'Quản lý users',
                link: 'users',
            }
        ],
    }
];

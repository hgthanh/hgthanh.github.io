# Thanh Social Network

Một mạng xã hội hiện đại được xây dựng với React và Supabase, deploy trên GitHub Pages.

## ✨ Tính năng

- 👥 **Quản lý người dùng**: Đăng ký, đăng nhập, xem hồ sơ
- 📝 **Đăng bài viết**: Tạo, xem, xóa bài viết với hình ảnh
- ❤️ **Tương tác**: Thích bài viết, bình luận
- 📱 **Responsive**: Giao diện thân thiện trên mọi thiết bị
- 🎨 **UI/UX đẹp**: Thiết kế hiện đại với Tailwind CSS

## 🏗️ Cấu trúc thư mục

```
src/
├── components/          # Các component dùng chung
│   ├── Header.js       # Header navigation
│   ├── PostCard.js     # Component hiển thị bài viết
│   ├── CommentSection.js # Component bình luận
│   └── Loading.js      # Component loading
├── pages/              # Các trang chính
│   ├── Home.js         # Trang chủ
│   ├── Users.js        # Danh sách người dùng
│   ├── CreatePost.js   # Tạo bài viết
│   └── Profile.js      # Hồ sơ/đăng nhập
├── context/            # React Context
│   └── AppContext.js   # Context quản lý state toàn cục
├── lib/                # Utilities và configs
│   └── supabase.js     # Cấu hình Supabase
├── App.js              # Component chính
├── App.css             # Styles CSS
└── index.js            # Entry point
```

## 🚀 Cài đặt và chạy

### 1. Clone repository

```bash
git clone https://github.com/hgthanh/hgthanh.github.io.git
cd thanh-social-network
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Supabase

1. Tạo tài khoản tại [Supabase](https://supabase.com)
2. Tạo project mới
3. Chạy SQL schema từ file `supabase-schema.sql` trong SQL Editor
4. Copy `.env.example` thành `.env` và điền thông tin:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 📦 Deploy lên GitHub Pages

### 1. Cập nhật package.json

Thay đổi `hgthanh` trong `YOUR_GITHUB_USERNAME`:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/thanh-social-network"
```

### 2. Cài đặt gh-pages

```bash
npm install --save-dev gh-pages
```

### 3. Deploy

```bash
npm run deploy
```

### 4. Cấu hình GitHub Repository

1. Vào Settings > Pages
2. Chọn Source: "Deploy from a branch"
3. Chọn Branch: "gh-pages"
4. Click Save

Trang web sẽ có sẵn tại: `https://YOUR_GITHUB_USERNAME.github.io/thanh-social-network`

## 🗄️ Database Schema

### Users Table
```sql
- id (BIGSERIAL, PRIMARY KEY)
- username (VARCHAR(50), UNIQUE, NOT NULL)
- email (VARCHAR(100), UNIQUE, NOT NULL)
- bio (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Posts Table
```sql
- id (BIGSERIAL, PRIMARY KEY)
- user_id (BIGINT, FOREIGN KEY)
- content (TEXT, NOT NULL)
- image_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Likes Table
```sql
- id (BIGSERIAL, PRIMARY KEY)
- user_id (BIGINT, FOREIGN KEY)
- post_id (BIGINT, FOREIGN KEY)
- created_at (TIMESTAMP)
- UNIQUE(user_id, post_id)
```

### Comments Table
```sql
- id (BIGSERIAL, PRIMARY KEY)
- user_id (BIGINT, FOREIGN KEY)
- post_id (BIGINT, FOREIGN KEY)
- content (TEXT, NOT NULL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18, React Router DOM
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: GitHub Pages

## 📱 Screenshots

### Trang chủ
- Hiển thị danh sách bài viết
- Tương tác thích, bình luận
- Responsive design

### Trang tạo bài viết
- Form tạo bài viết với hình ảnh
- Preview hình ảnh
- Validation form

### Trang người dùng
- Danh sách tất cả người dùng
- Thông tin cá nhân
- Grid layout responsive

## 🔧 Customization

### Thay đổi màu sắc
Chỉnh sửa file `public/index.html` trong phần Tailwind config:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Thay đổi màu chính ở đây
          600: '#your-color',
        }
      }
    }
  }
}
```

### Thêm tính năng mới
1. Tạo component trong `src/components/`
2. Thêm page trong `src/pages/`
3. Cập nhật routing trong `src/App.js`
4. Thêm database functions trong `src/lib/supabase.js`

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- GitHub: [@hgthanh](https://github.com/hgthanh)
- Email: admin@thazh.is-a.dev

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [GitHub Pages](https://pages.github.com/)
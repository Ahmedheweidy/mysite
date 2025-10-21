// assets/js/main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, Timestamp, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig, ADMIN_EMAIL } from "./firebase-config.js";

// Global Firebase variables
let app;
let db;
let auth;
// Default user ID used if no user is authenticated (prevents errors in path construction)
let userId = 'default_user'; 
let BLOG_COLLECTION_PATH = 'artifacts/blog-manager-app/users/default_user/posts'; // Using 'default_user' initially
const UI_CONTENT_PATH = 'artifacts/ui-manager-app/ui_content/data'; // Single document path for UI content
let uiData = {}; // Global variable to hold the fetched UI content
let currentLang = "en";


// ---------------------------------------------
// Language Data and Functions
// ---------------------------------------------

const content = {
// ... (Language data remains unchanged - this acts as fallback/default)
    en: {
        page_title: "Ahmed Heweide | Operations & Hospitality Expert Dashboard",
        header_subtitle: "Operations Manager",
        lang_button: "العربية",
        contact_now_btn: "Contact Now",
        nav_about: "About",
        nav_kpis: "KPIs",
        nav_projects: "Projects",
        nav_expertise: "Expertise",
        nav_career: "Career",
        nav_certifications: "Certifications",
        nav_testimonials: "Testimonials",
        nav_blog: "Blog",
        admin_login_btn: "Login",
        admin_login_btn_logged_in: "Admin / Logout",
        admin_unauthorized_msg: "Authorization failed. Please log in with the admin email.",
        admin_panel_title: "🔒 Admin Panel: Manage Blog Posts",
        admin_add_post_title: "Add New Post",
        admin_title_en: "Title (English)",
        admin_title_ar: "Title (Arabic)",
        admin_desc_en: "Short Description (English)",
        admin_desc_ar: "Short Description (Arabic)",
        admin_content: "Post Content (in Markdown)",
        admin_save_btn: "Save Post",
        admin_cancel_btn: "Cancel",
        admin_current_posts_title: "Current Posts",
        admin_edit_btn: "Edit",
        admin_delete_btn: "Delete",
        blog_loading: "Loading posts...",
        blog_back_btn: "← Back to all posts",
        blog_read_more: "Read Article →",
        blog_title: '<span class="accent-color">&#x270D;</span> Blog - Operational Leadership Articles',
        
        // Hero Section
        about_tagline: "Operations Manager | Hospitality & Property Management Expert",
        about_main_title: "Ahmed Heweide: Strategic Leadership for <span class='accent-color'>Profit Growth</span>.",
        about_body: "I am a dedicated Operations Manager specializing in hospitality and property management. My focus is on driving operational excellence and financial efficiency. I lead innovative solutions—like developing in-house Property Management Systems (PMS)—to sharply reduce costs and increase revenue. Committed to building strategic partnerships and leading large teams towards corporate objectives.",
        cv_download_btn: "Download CV",
        linkedin_btn: "View LinkedIn",
        photo_placeholder: "Professional Photo",
        
        // KPIs
        kpis_title: '<span class="accent-color">&#x26A1;</span> Tangible Results (Delta Dream)',
        kpi1_label: "Quarterly System Cost Savings",
        kpi1_desc: "Saved (EGP) by developing an in-house Property Management System (PMS).",
        kpi2_label: "Annual Booking Growth",
        kpi2_desc: "Increase in bookings vs. previous year (Achieved 6,396 bookings).",
        kpi3_label: "Operational Scope",
        kpi3_desc: "Managed: 200 chalets, 2 hotels (42 suites/rooms), and 1 Oriental grill restaurant.",
        
        // Projects
        projects_title: '<span class="accent-color">&#x270F;</span> Projects & Success Stories',
        project1_tag: "Operational Technology",
        project1_title: "Custom In-House PMS",
        project1_desc: "Led the development of a software solution to reduce reliance on expensive external systems.",
        project1_label: "Cost Reduction",
        project1_item1: "**Challenge:** The previous PMS system cost EGP 900K quarterly.",
        project1_item2: "**Solution:** I led the development of an internal PMS, from design to execution.",
        project1_item3: "**Result:** Quarterly operational cost was reduced to simple annual hosting fees, achieving savings of over **EGP 750K per quarter** after covering the one-time development cost (EGP 150K).",
        project2_tag: "Strategic Growth",
        project2_title: "Portfolio Expansion & +20% Growth",
        project2_desc: "Effective strategies to increase revenue and expand the base of managed properties.",
        project2_label: "Revenue Increase",
        project2_item1: "**Mission:** Achieve growth in bookings and expand the managed property portfolio.",
        project2_item2: "**Actions:** Managed owner relations and strategic partnerships to expand the company's portfolio.",
        project2_item3: "**Result:** A jump in annual revenue, achieving **6,396 bookings**, representing a **20% growth** over the previous year.",
        
        // Testimonials
        testimonials_title: '<span class="accent-color">&#x2b50;</span> What Partners and Managers Say',
        testimonial1_quote: `"Ahmed possesses clear strategic leadership. His ability to identify cost-saving opportunities—such as the in-house PMS project—was crucial in achieving high profitable sustainability."`,
        testimonial1_name: "Former Manager (Placeholder)",
        testimonial1_role: "CEO, Delta Dream",
        testimonial2_quote: `"His relationship management skills allowed us to expand confidently. Ahmed handles owners and partners with high professionalism, ensuring sustainable growth in our property portfolio."`,
        testimonial2_name: "Partner (Placeholder)",
        testimonial2_role: "Major Property Owner",
        testimonials_footer: 'More verified testimonials are available on my <a href="https://www.linkedin.com/in/ahmedheweide" target="_blank" class="accent-color hover:underline">LinkedIn</a> page.',

        // Expertise
        expertise_title: '<span class="accent-color">&#x2699;</span> Core Expertise',
        skill1_title: "Partner Relations",
        skill1_desc: "Portfolio expansion through strategic partnerships.",
        skill2_title: "Project Management",
        skill2_desc: "Leading critical projects like in-house PMS development end-to-end.",
        skill3_title: "Cost Reduction",
        skill3_desc: "Achieving multi-million EGP savings and ROI analysis.",
        skill4_title: "Strategic Planning",
        skill4_desc: "Full-authority decision making and defining future corporate plans.",
        skill5_title: "Team Leadership",
        skill5_desc: "Experienced in leading large teams and managing HR efficiently.",
        skill6_title: "Hotel PMS",
        skill6_desc: "Deep expertise in hotel operations and custom PMS development.",
        skill7_title: "Problem-Solving",
        skill7_desc: "Designing and implementing tailored solutions to address operational gaps.",
        skill8_title: "Stakeholder Relations",
        skill8_desc: "Ensuring positive client experience and managing key partnerships.",

        // Certifications
        certifications_title: '<span class="accent-color">&#x1F393;</span> Qualifications & Certifications',
        cert1_title: "Managerial Expertise in Hotel PMS Operations",
        cert1_desc: "Beyond Basics",
        cert2_title: "Quality Management for Operational Excellence",
        cert2_desc: "Specialized Qualification",
        cert3_title: "Front-End Web Development Diploma",
        cert3_desc: "Web Development",
        cert4_title: "Programming Fundamentals Diploma",
        cert4_desc: "Fundamentals",
        certifications_footer: "Also: Working with Difficult People and AMIDEAST Scholarship.",

        // Career (Note: Dates and locations often remain fixed, but included for completeness)
        career_title: '<span class="accent-color">&#x23F1;</span> Career Path - Experience History',
        career1_date: "March 2024 - Present",
        career1_title: "Operations Manager",
        career1_location: "Delta Dream | Egypt",
        career1_item1: "Full strategic leadership for projects including 200 chalets, two hotels, and a restaurant.",
        career1_item2: "Managed a seasonal operational budget of EGP 7.3 million efficiently.",
        career1_item3: "Managed owner relations (chalet owners) to expand the company's portfolio.",
        career4_date: "Education",
        career4_title: "Bachelor of Business Administration (BBA)",
        career4_location: "Kafr El Sheikh University",
        
        // Contact (Placeholder texts are also in content)
        contact_title: '<span class="accent-color">|</span> Contact Ahmed Heweide',
        contact_desc: "For strategic partnership opportunities or consultation on operations and hospitality management, please reach out.",
        contact_name_label: "Full Name",
        contact_name_placeholder: "Enter your name",
        contact_email_label: "Email Address",
        contact_email_placeholder: "Enter your email",
        contact_message_label: "Project Scope / Inquiry",
        contact_message_placeholder: "Describe the type of partnership or challenge you are facing",
        contact_submit_btn: "Send Message",
        formspree_notice: "*This form uses the FormSubmit service to ensure email delivery without server-side code. Please try submitting a test email to verify the connection.",
        footer_text1: '&copy; 2025 Ahmed Heweide | Operations Manager. Performance-driven Minimalist Design.',
    },
    ar: {
        page_title: "أحمد هويدي | لوحة تحكم خبير العمليات والضيافة",
        header_subtitle: "مدير العمليات",
        lang_button: "English",
        contact_now_btn: "تواصل الآن",
        nav_about: "النبذة",
        nav_kpis: "مؤشرات الأداء",
        nav_projects: "المشاريع",
        nav_expertise: "الخبرات الجوهرية",
        nav_career: "المسار المهني",
        nav_certifications: "المؤهلات والشهادات",
        nav_testimonials: "التوصيات",
        nav_blog: "المدونة",
        admin_login_btn: "تسجيل الدخول",
        admin_login_btn_logged_in: "المشرف / خروج",
        admin_unauthorized_msg: "فشل التحقق من الصلاحية. الرجاء تسجيل الدخول باستخدام إيميل المشرف.",
        admin_panel_title: "🔒 لوحة تحكم المشرف: إدارة مقالات المدونة",
        admin_add_post_title: "إضافة مقال جديد",
        admin_title_en: "العنوان (الإنجليزية)",
        admin_title_ar: "العنوان (العربية)",
        admin_desc_en: "وصف مختصر (الإنجليزية)",
        admin_desc_ar: "وصف مختصر (العربية)",
        admin_content: "محتوى المقال (بصيغة Markdown)",
        admin_save_btn: "حفظ المقال",
        admin_cancel_btn: "إلغاء",
        admin_current_posts_title: "المقالات الحالية",
        admin_edit_btn: "تعديل",
        admin_delete_btn: "حذف",
        blog_loading: "جارٍ تحميل المقالات...",
        blog_back_btn: "← العودة لجميع المقالات",
        blog_read_more: "اقرأ المقال →",
        blog_title: '<span class="accent-color">&#x270D;</span> المدونة - مقالات في القيادة التشغيلية',

        // Hero Section
        about_tagline: "مدير العمليات | خبير في الضيافة وإدارة الممتلكات",
        about_main_title: "أحمد هويدي: قيادة استراتيجية لتحقيق <span class='accent-color'>نمو الأرباح</span>.",
        about_body: "أنا مدير عمليات متخصص في إدارة الضيافة والممتلكات. أركز على دفع التميز التشغيلي والكفاءة المالية. أقود حلولًا مبتكرة—مثل تطوير أنظمة إدارة ممتلكات داخلية (PMS)—لخفض التكاليف بشكل حاد وزيادة الإيرادات. ملتزم ببناء شراكات استراتيجية وقيادة فرق كبيرة نحو تحقيق الأهداف المؤسسية.",
        cv_download_btn: "تحميل السيرة الذاتية",
        linkedin_btn: "عرض الملف الشخصي في LinkedIn",
        photo_placeholder: "صورة احترافية",
        
        // KPIs
        kpis_title: '<span class="accent-color">&#x26A1;</span> نتائج ملموسة (دلتا دريم)',
        kpi1_label: "وفورات ربع سنوية في تكاليف الأنظمة",
        kpi1_desc: "تم توفيره (بالجنيه المصري) عبر تطوير نظام إدارة ممتلكات داخلي (PMS).",
        kpi2_label: "النمو السنوي للحجوزات",
        kpi2_desc: "زيادة في الحجوزات مقارنة بالعام السابق (تم تحقيق 6,396 حجز).",
        kpi3_label: "نطاق الإدارة التشغيلية",
        kpi3_desc: "تمت إدارة: 200 شاليه، فندقان (42 جناح/غرفة)، ومطعم مشاوي شرقي واحد.",

        // Projects
        projects_title: '<span class="accent-color">&#x270F;</span> المشاريع وقصص النجاح',
        project1_tag: "التقنية التشغيلية",
        project1_title: "نظام PMS داخلي مخصص",
        project1_desc: "قُدتُ تطوير حل برمجي لتقليل الاعتماد على الأنظمة الخارجية باهظة الثمن.",
        project1_label: "خفض التكاليف",
        project1_item1: "**التحدي:** كان النظام السابق لإدارة الممتلكات يكلف 900 ألف جنيه مصري ربع سنويًا.",
        project1_item2: "**الحل:** قُدتُ تطوير نظام PMS داخلي، بدءاً من التصميم وحتى التنفيذ.",
        project1_item3: "**النتيجة:** انخفضت التكلفة التشغيلية الربع سنوية إلى رسوم استضافة سنوية بسيطة، محققاً وفراً تجاوز **750 ألف جنيه مصري كل ربع سنة** بعد تغطية تكلفة التطوير لمرة واحدة (150 ألف جنيه مصري).",
        project2_tag: "النمو الاستراتيجي",
        project2_title: "توسيع المحفظة ونمو +20%",
        project2_desc: "استراتيجيات فعالة لزيادة الإيرادات وتوسيع قاعدة الممتلكات المدارة.",
        project2_label: "زيادة الإيرادات",
        project2_item1: "**المهمة:** تحقيق نمو في الحجوزات وتوسيع محفظة الممتلكات المدارة.",
        project2_item2: "**الإجراءات:** إدارة علاقات الملاك والشراكات الاستراتيجية لتوسيع محفظة الشركة.",
        project2_item3: "**النتيجة:** قفزة في الإيرادات السنوية، بتحقيق **6,396 حجزًا**، وهو ما يمثل **نموًا بنسبة 20%** مقارنة بالعام السابق.",
        
        // Testimonials
        testimonials_title: '<span class="accent-color">&#x2b50;</span> ما يقوله الشركاء والمدراء',
        testimonial1_quote: `"يمتلك أحمد قيادة استراتيجية واضحة. كانت قدرته على تحديد فرص خفض التكاليف—مثل مشروع نظام PMS الداخلي—حاسمة في تحقيق استدامة عالية ومربحة."`,
        testimonial1_name: "مدير سابق (نموذجي)",
        testimonial1_role: "الرئيس التنفيذي، دلتا دريم",
        testimonial2_quote: `"سمحت لنا مهاراته في إدارة العلاقات بالتوسع بثقة. يتعامل أحمد مع الملاك والشركاء باحترافية عالية، مما يضمن نمواً مستداماً في محفظتنا العقارية."`,
        testimonial2_name: "شريك (نموذجي)",
        testimonial2_role: "مالك عقارات رئيسي",
        testimonials_footer: 'المزيد من التوصيات الموثقة متاحة على صفحتي في <a href="https://www.linkedin.com/in/ahmedheweide" target="_blank" class="accent-color hover:underline">LinkedIn</a>.',

        // Expertise
        expertise_title: '<span class="accent-color">&#x2699;</span> الخبرات الجوهرية',
        skill1_title: "إدارة علاقات الشركاء",
        skill1_desc: "توسيع المحفظة من خلال الشراكات الاستراتيجية.",
        skill2_title: "إدارة المشاريع",
        skill2_desc: "قيادة المشاريع الحاسمة مثل تطوير نظام PMS داخلي من البداية للنهاية.",
        skill3_title: "خفض التكاليف",
        skill3_desc: "تحقيق وفورات بملايين الجنيهات وتحليل العائد على الاستثمار.",
        skill4_title: "التخطيط الاستراتيجي",
        skill4_desc: "اتخاذ القرارات بصلاحية كاملة وتحديد الخطط المؤسسية المستقبلية.",
        skill5_title: "قيادة الفرق",
        skill5_desc: "خبرة في قيادة الفرق الكبيرة وإدارة الموارد البشرية بكفاءة.",
        skill6_title: "عمليات أنظمة PMS الفندقية",
        skill6_desc: "خبرة عميقة في العمليات الفندقية وتطوير أنظمة PMS مخصصة.",
        skill7_title: "حل المشكلات",
        skill7_desc: "تصميم وتنفيذ حلول مصممة خصيصاً لسد الثغرات التشغيلية.",
        skill8_title: "علاقات أصحاب المصلحة",
        skill8_desc: "ضمان تجربة إيجابية للعملاء وإدارة الشراكات الرئيسية.",

        // Certifications
        certifications_title: '<span class="accent-color">&#x1F393;</span> المؤهلات والشهادات',
        cert1_title: "خبرة إدارية في عمليات أنظمة PMS الفندقية",
        cert1_desc: "مستوى متقدم",
        cert2_title: "إدارة الجودة للتميز التشغيلي",
        cert2_desc: "تأهيل متخصص",
        cert3_title: "دبلوم تطوير الويب (الواجهات الأمامية)",
        cert3_desc: "تطوير الويب",
        cert4_title: "دبلوم أساسيات البرمجة",
        cert4_desc: "الأساسيات",
        certifications_footer: "أيضاً: التعامل مع الشخصيات الصعبة ومنحة AMIDEAST.",

        // Career
        career_title: '<span class="accent-color">&#x23F1;</span> المسار المهني - تاريخ الخبرة',
        career1_date: "مارس 2024 - الوقت الحالي",
        career1_title: "مدير العمليات",
        career1_location: "دلتا دريم | مصر",
        career1_item1: "قيادة استراتيجية كاملة لمشاريع تشمل 200 شاليه وفندقين ومطعم.",
        career1_item2: "إدارة ميزانية تشغيلية موسمية بقيمة 7.3 مليون جنيه مصري بكفاءة.",
        career1_item3: "إدارة علاقات الملاك (أصحاب الشاليهات) لتوسيع محفظة الشركة.",
        career4_date: "التعليم",
        career4_title: "بكالوريوس إدارة الأعمال",
        career4_location: "جامعة كفر الشيخ",
        
        // Contact
        contact_title: '<span class="accent-color">|</span> تواصل مع أحمد هويدي',
        contact_desc: "For strategic partnership opportunities or consultation on operations and hospitality management, please reach out.",
        contact_name_label: "Full Name",
        contact_name_placeholder: "Enter your name",
        contact_email_label: "Email Address",
        contact_email_placeholder: "Enter your email",
        contact_message_label: "Project Scope / Inquiry",
        contact_message_placeholder: "Describe the type of partnership or challenge you are facing",
        contact_submit_btn: "Send Message",
        formspree_notice: "*This form uses the FormSubmit service to ensure email delivery without server-side code. Please try submitting a test email to verify the connection.",
        footer_text1: '&copy; 2025 Ahmed Heweide | Operations Manager. Performance-driven Minimalist Design.',
    }
};

function setLanguage(lang) {
    currentLang = lang;
    
    // Merge local content with Firestore content (Firestore data overrides local data)
    // We use data.ui_en and data.ui_ar keys from Firestore
    const localContent = content[lang];
    const firestoreContent = (lang === 'ar') ? uiData.ui_ar : uiData.ui_en;
    
    // Final content object for the current language
    const finalContent = { ...localContent, ...(firestoreContent || {}) };
    
    const body = document.body;
    
    const dir = (lang === 'ar') ? 'rtl' : 'ltr';
    body.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);

    for (const key in finalContent) {
        const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
        elements.forEach(el => {
            el.innerHTML = finalContent[key];
        });

        const placeholderElements = document.querySelectorAll(`[data-i18n-placeholder="${key}"]`);
        placeholderElements.forEach(el => {
            if (el.placeholder !== undefined) {
                el.placeholder = finalContent[key];
                el.style.textAlign = (lang === 'ar') ? 'right' : 'left'; 
            }
        });
    }
    
    // FIX: Apply RTL specific alignment to static elements in the Hero section
    const heroTextContainer = document.getElementById('hero-text-container');
    if (heroTextContainer) {
        // Ensure the entire text block aligns right
        heroTextContainer.style.textAlign = (lang === 'ar') ? 'right' : 'left'; 
    }

    document.getElementById('page-title').textContent = finalContent.page_title;
    const langButton = document.getElementById('lang-toggle-button');
    if (langButton) langButton.textContent = (lang === 'ar') ? 'English' : 'العربية';
    
    // Update Admin button text based on current authentication state
    const adminButton = document.getElementById('admin-toggle-button');
    if (adminButton) {
        if (auth?.currentUser?.email === ADMIN_EMAIL) {
            adminButton.textContent = content[currentLang].admin_login_btn_logged_in;
        } else {
            adminButton.textContent = content[currentLang].admin_login_btn;
        }
    }
    
    // Re-render blog posts to update language for dynamic content
    if (db) renderBlogPosts();
}


// دالة التبديل بين اللغات (تم إصلاحها لتعمل بشكل صحيح)
function toggleLanguage() {
    const newLang = (currentLang === 'en') ? 'ar' : 'en';
    setLanguage(newLang);
    
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('mobile-menu-open')) {
        toggleMenu();
    }
}

// دالة فتح/إغلاق قائمة التنقل للهاتف
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('menu-button');
    
    menu.classList.toggle('mobile-menu-open');
    
    const isExpanded = menu.classList.contains('mobile-menu-open');
    button.setAttribute('aria-expanded', isExpanded);
}

// ---------------------------------------------
// Firebase Initialization & Auth & UI Content Fetching
// ---------------------------------------------

async function initFirebase() {
    try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.projectId; 
        
        // 1. Ensure initialization happens once
        if (!app) {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
        }
        
        // 2. Setup Auth State Listener
        onAuthStateChanged(auth, (user) => {
            const adminButton = document.getElementById('admin-toggle-button');
            
            // Handle user change
            if (user) {
                userId = user.uid;
                // Path is constructed using the actual UID if logged in
                BLOG_COLLECTION_PATH = `artifacts/${appId}/users/${userId}/posts`; 
            } else {
                // If signed out, revert to default_user path
                userId = 'default_user';
                BLOG_COLLECTION_PATH = `artifacts/${appId}/users/${userId}/posts`; 
            }

            const isAdmin = user && user.email === ADMIN_EMAIL;
        
            if (isAdmin) {
                adminButton.textContent = content[currentLang].admin_login_btn_logged_in;
                // FIX: Show admin panel automatically on successful login if it was triggered manually
                const isManualLogin = document.getElementById('login-modal')?.classList.contains('show');
                document.getElementById('login-modal')?.classList.remove('show');
                if (isManualLogin) {
                    toggleAdminPanel(); // Show the panel immediately after manual successful login
                }

            } else {
                adminButton.textContent = content[currentLang].admin_login_btn;
                hideAdminPanel();
            }
            adminButton.disabled = false; // Enable button after auth state is known
            
            // Render posts based on the new user ID (either logged in or default_user)
            renderBlogPosts(); 
        });
        
        // 3. Fetch and watch the UI Content document
        const uiDocRef = doc(db, 'artifacts', appId, 'ui_content', 'data'); 
        onSnapshot(uiDocRef, (docSnap) => {
            if (docSnap.exists()) {
                uiData = docSnap.data();
                setLanguage(currentLang); // Re-render UI after data is fetched/updated
            } else {
                console.warn("UI content document not found. Using local fallbacks.");
                uiData = {}; // Use empty object if not found
                setLanguage(currentLang); // Use fallbacks/local content
            }
        }, (error) => {
             console.error("Firestore UI content watch error: ", error);
        });

    } catch (e) {
        console.error("Error during Firebase initialization or authentication: ", e);
        document.getElementById('blog-posts-container').innerHTML = '<p class="col-span-3 text-center text-red-400">Failed to load blog posts. Check console for Firebase errors.</p>';
    }
}

// ---------------------------------------------
// Blog Management (CRUD)
// ---------------------------------------------

function renderBlogPosts() {
    if (!db) return;
    
    // NOTE: Path updated by onAuthStateChanged listener
    const q = query(collection(db, BLOG_COLLECTION_PATH), orderBy('date', 'desc')); 
    const container = document.getElementById('blog-posts-container');
    const listContainer = document.getElementById('posts-list');
    
    // Show loading message
    const loadingMessage = content[currentLang].blog_loading;
    if (!container.innerHTML || container.innerHTML.includes(loadingMessage)) {
         container.innerHTML = `<p class="col-span-3 text-center text-gray-500" data-i18n="blog_loading">${loadingMessage}</p>`;
    }

    onSnapshot(q, (snapshot) => {
        let postsHTML = '';
        let adminListHTML = '';
        const isAdmin = auth?.currentUser?.email === ADMIN_EMAIL;
        
        snapshot.forEach(doc => {
            const post = doc.data();
            const postId = doc.id;
            const dateStr = new Date(post.date.seconds * 1000).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
            
            // Public Card HTML
            postsHTML += `
                <div id="post-${postId}" class="data-card p-6 rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-[#00ffaa33]" onclick="showFullPost('${postId}')">
                    <p class="text-xs uppercase text-gray-500 mb-2">${dateStr}</p>
                    <h4 class="text-xl font-bold mb-3 accent-color">${currentLang === 'ar' ? post.title_ar : post.title_en}</h4>
                    <p class="text-gray-400 text-sm mb-3">${currentLang === 'ar' ? post.desc_ar : post.desc_en}</p>
                    <button class="text-xs accent-color mt-3 inline-block hover:underline">${content[currentLang].blog_read_more}</button>
                </div>
            `;
            
            // Admin List HTML (Visible if logged in as admin)
            if (isAdmin) {
                const postDataForEdit = JSON.stringify({
                    title_en: post.title_en,
                    title_ar: post.title_ar,
                    desc_en: post.desc_en,
                    desc_ar: post.desc_ar,
                    content: post.content
                }).replace(/'/g, "\\'").replace(/"/g, '&quot;');

                adminListHTML += `
                    <div class="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                        <span class="text-gray-300 text-sm">${post.title_en} (${dateStr})</span>
                        <div>
                            <button onclick="editPost('${postId}', '${postDataForEdit}')" class="text-blue-400 hover:text-blue-300 text-sm mx-2">${content[currentLang].admin_edit_btn}</button>
                            <button onclick="deletePost('${postId}')" class="text-red-400 hover:text-red-300 text-sm">${content[currentLang].admin_delete_btn}</button>
                        </div>
                    </div>
                `;
            }
        });
        
        container.innerHTML = postsHTML || `<p class="col-span-3 text-center text-gray-500">${content[currentLang].blog_loading}</p>`;
        listContainer.innerHTML = adminListHTML || `<p class="text-gray-500 text-sm">No posts yet.</p>`;
        
        document.querySelector('#blog h3').innerHTML = content[currentLang].blog_title;

    }, (error) => {
        console.error("Firestore read error: ", error);
        container.innerHTML = '<p class="col-span-3 text-center text-red-400">Error loading posts. Check console for details.</p>';
    });
}

// Function to save/update a post
async function savePost() {
    if (!db || !auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) { 
        alert(content[currentLang].admin_unauthorized_msg);
        return;
    }

    const id = document.getElementById('post-id').value;
    const titleEn = document.getElementById('post-title-en').value.trim();
    const titleAr = document.getElementById('post-title-ar').value.trim();
    const descEn = document.getElementById('post-desc-en').value.trim();
    const descAr = document.getElementById('post-desc-ar').value.trim();
    const postContent = document.getElementById('post-content').value.trim();
    const status = document.getElementById('admin-status');

    if (!titleEn || !titleAr || !postContent) {
        status.textContent = (currentLang === 'ar') ? 'الرجاء ملء جميع الحقول المطلوبة (العناوين والمحتوى).' : 'Please fill all required fields (Titles and Content).';
        return;
    }

    status.textContent = (currentLang === 'ar') ? 'جاري الحفظ...' : 'Saving...';

    const postData = {
        title_en: titleEn,
        title_ar: titleAr,
        desc_en: descEn,
        desc_ar: descAr,
        content: postContent, // Markdown content
        date: Timestamp.now(),
    };
    
    const postsCollectionRef = collection(db, BLOG_COLLECTION_PATH);

    try {
        if (id) {
            // Update existing document, using merge to keep existing fields if not overwritten
            await setDoc(doc(postsCollectionRef, id), postData, { merge: true });
            status.textContent = (currentLang === 'ar') ? 'تم تحديث المقال بنجاح!' : 'Post updated successfully!';
        } else {
            // Add new document
            await setDoc(doc(postsCollectionRef), postData);
            status.textContent = (currentLang === 'ar') ? 'تمت إضافة مقال جديد بنجاح!' : 'New post added successfully!';
        }
        
        // Clear form and hide panel
        setTimeout(() => {
            document.getElementById('admin-status').textContent = '';
            document.getElementById('post-id').value = '';
            document.getElementById('post-title-en').value = '';
            document.getElementById('post-title-ar').value = '';
            document.getElementById('post-desc-en').value = '';
            document.getElementById('post-desc-ar').value = '';
            document.getElementById('post-content').value = '';
            // hideAdminPanel(); // Keep open for convenience
        }, 1500);

    } catch (e) {
        console.error("Error saving post: ", e);
        status.textContent = (currentLang === 'ar') ? 'حدث خطأ أثناء حفظ المقال. تحقق من الـ Console.' : 'Error saving post. Check console.';
    }
}

// Function to delete a post
async function deletePost(id) {
    if (!db || !auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) { 
        alert(content[currentLang].admin_unauthorized_msg);
        return;
    }
    const deleteMessage = (currentLang === 'ar') ? 'هل أنت متأكد أنك تريد حذف هذا المقال؟' : 'Are you sure you want to delete this post?';
    
    if (confirm(deleteMessage)) { 
        try {
            const postsCollectionRef = collection(db, BLOG_COLLECTION_PATH);
            await deleteDoc(doc(postsCollectionRef, id));
        } catch (e) {
            console.error("Error deleting post: ", e);
            alert("Error deleting post. Check console.");
        }
    }
}

// Function to display the full post content
async function showFullPost(postId) {
    if (!db) return;
    try {
        const docRef = doc(db, BLOG_COLLECTION_PATH, postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const post = docSnap.data();
            const container = document.getElementById('full-post-view');
            const titleElement = document.getElementById('full-post-title');
            const dateElement = document.getElementById('full-post-date');
            const contentElement = document.getElementById('full-post-content');
            
            const dateStr = new Date(post.date.seconds * 1000).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
            
            // Check if 'marked' is loaded globally, otherwise use a fallback
            const htmlContent = window.marked ? window.marked.parse(post.content) : `<pre>${post.content}</pre>`;
            
            titleElement.textContent = (currentLang === 'ar' ? post.title_ar : post.title_en);
            dateElement.textContent = dateStr;
            contentElement.innerHTML = htmlContent;
            
            document.getElementById('blog-posts-container').classList.add('hidden');
            document.getElementById('full-post-view').classList.remove('hidden');
            
            container.scrollIntoView({ behavior: 'smooth' });

        } else {
            alert((currentLang === 'ar') ? 'المقال غير موجود!' : 'Post not found!');
        }
    } catch (e) {
        console.error("Error fetching full post: ", e);
        alert((currentLang === 'ar') ? 'حدث خطأ أثناء تحميل المقال.' : 'Error loading post.');
    }
}

// Function to hide the full post view
function hideFullPost() {
    document.getElementById('full-post-view').classList.add('hidden');
    document.getElementById('blog-posts-container').classList.remove('hidden');
    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
}

// Function to load post data into the form for editing
function editPost(id, postJsonString) {
    // FIX: Properly parse the JSON string which was double-escaped in renderBlogPosts
    let post;
    try {
        post = JSON.parse(postJsonString.replace(/&quot;/g, '"').replace(/\\'/g, "'"));
    } catch (e) {
        console.error("Error parsing post data for editing:", e);
        alert("Error loading post data for editing.");
        return;
    }

    // Check authorization first
    if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
        alert(content[currentLang].admin_unauthorized_msg);
        return;
    }
    
    // Switch to Blog Tab if we are editing a post
    switchAdminTab('blog'); 

    document.getElementById('post-id').value = id;
    document.getElementById('post-title-en').value = post.title_en;
    document.getElementById('post-title-ar').value = post.title_ar;
    document.getElementById('post-desc-en').value = post.desc_en;
    document.getElementById('post-desc-ar').value = post.desc_ar;
    document.getElementById('post-content').value = post.content;
    document.getElementById('admin-status').textContent = (currentLang === 'ar') ? 'جاري تعديل المقال...' : 'Editing post...';
    
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
}


// ---------------------------------------------
// UI Content Management
// ---------------------------------------------

// Function to handle showing the UI content editing interface
function showUIContentEditor() {
    if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
        alert(content[currentLang].admin_unauthorized_msg);
        return;
    }
    
    const editorContainer = document.getElementById('ui-editor-container');
    const status = document.getElementById('ui-admin-status');
    
    if (!editorContainer) {
        status.textContent = "Error: UI Editor container not found.";
        return;
    }

    status.textContent = (currentLang === 'ar') ? 'جاري تحميل محتوى الواجهة...' : 'Loading UI content...';

    // Data keys to display in the editor (Only data with different EN/AR versions needed)
    const keys = [
        'header_subtitle', 'about_tagline', 'about_main_title', 'about_body', 
        'kpis_title', 'kpi1_label', 'kpi1_desc', 'kpi2_label', 'kpi2_desc', 
        'kpi3_label', 'kpi3_desc',
        'projects_title', 'project1_title', 'project1_desc', 'project1_item1', 'project1_item2', 'project1_item3',
        'project2_title', 'project2_desc', 'project2_item1', 'project2_item2', 'project2_item3',
        'expertise_title', 'skill1_title', 'skill1_desc', 'skill2_title', 'skill2_desc', 
        'skill3_title', 'skill3_desc', 'skill4_title', 'skill4_desc', 'skill5_title', 'skill5_desc', 
        'skill6_title', 'skill6_desc', 'skill7_title', 'skill7_desc', 'skill8_title', 'skill8_desc',
        'testimonials_title', 'testimonial1_quote', 'testimonial1_name', 'testimonial1_role', 
        'testimonial2_quote', 'testimonial2_name', 'testimonial2_role',
        'certifications_title', 'cert1_title', 'cert1_desc', 'cert2_title', 'cert2_desc', 
        'cert3_title', 'cert3_desc', 'cert4_title', 'cert4_desc', 'certifications_footer',
    ];

    let html = '';
    
    // Iterate over keys to build the form
    keys.forEach(key => {
        // Use merged data (Firestore or local fallback)
        const enValue = uiData?.ui_en?.[key] || content.en[key] || '';
        const arValue = uiData?.ui_ar?.[key] || content.ar[key] || '';
        
        const isLongText = key.includes('body') || key.includes('desc') || key.includes('quote') || key.includes('item');

        html += `
            <div class="mb-6 p-4 border border-gray-700 rounded-lg">
                <label class="block text-lg font-semibold mb-2 accent-color">${key}</label>
                <p class="text-sm text-gray-500 mb-2">${isLongText ? 'Use Textarea (supports **bold** and Markdown for lists where applicable)' : 'Use Input'}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        `;
        
        // English Field
        if (isLongText) {
            html += `
                <textarea data-key="${key}" data-lang="en" placeholder="${key} (English)" rows="4" class="w-full text-left" required>${enValue}</textarea>
            `;
        } else {
            html += `
                <input type="text" data-key="${key}" data-lang="en" placeholder="${key} (English)" value="${enValue}" class="w-full text-left" required>
            `;
        }

        // Arabic Field
        if (isLongText) {
            html += `
                <textarea data-key="${key}" data-lang="ar" placeholder="${key} (Arabic)" rows="4" class="w-full text-right" required>${arValue}</textarea>
            `;
        } else {
            html += `
                <input type="text" data-key="${key}" data-lang="ar" placeholder="${key} (Arabic)" value="${arValue}" class="w-full text-right" required>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    });
    
    editorContainer.innerHTML = html;
    status.textContent = (currentLang === 'ar') ? 'جاهز للتعديل.' : 'Ready for editing.';
}

// Function to save the UI content
async function saveUIContent() {
    if (!db || !auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) { 
        alert(content[currentLang].admin_unauthorized_msg);
        return;
    }
    
    const status = document.getElementById('ui-admin-status');
    const saveButton = document.getElementById('save-ui-btn');
    const editorContainer = document.getElementById('ui-editor-container');
    
    saveButton.disabled = true;
    status.textContent = (currentLang === 'ar') ? 'جاري الحفظ...' : 'Saving...';
    
    const newUIContent = {
        ui_en: {},
        ui_ar: {}
    };

    // Extract data from the form fields
    const fields = editorContainer.querySelectorAll('[data-key]');
    fields.forEach(field => {
        const key = field.getAttribute('data-key');
        const lang = field.getAttribute('data-lang');
        
        if (lang === 'en') {
            newUIContent.ui_en[key] = field.value.trim();
        } else if (lang === 'ar') {
            newUIContent.ui_ar[key] = field.value.trim();
        }
    });

    try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.projectId; 
        const uiDocRef = doc(db, 'artifacts', appId, 'ui_content', 'data'); 
        
        // Use setDoc to replace the entire content document
        await setDoc(uiDocRef, newUIContent);
        
        // The onSnapshot listener in initFirebase will catch this update and call setLanguage
        
        status.textContent = (currentLang === 'ar') ? 'تم تحديث محتوى الواجهة بنجاح!' : 'UI content updated successfully!';
        
        setTimeout(() => {
            status.textContent = '';
        }, 1500);

    } catch (e) {
        console.error("Error saving UI content: ", e);
        status.textContent = (currentLang === 'ar') ? 'حدث خطأ أثناء حفظ المحتوى. تحقق من الـ Console.' : 'Error saving UI content. Check console.';
    } finally {
        saveButton.disabled = false;
    }
}


// Admin Panel Visibility Toggles
function switchAdminTab(tab) {
    const blogSection = document.getElementById('blog-manager-section');
    const uiSection = document.getElementById('ui-manager-section');
    const blogButton = document.getElementById('toggle-blog-manager');
    const uiButton = document.getElementById('toggle-ui-manager');
    
    if (tab === 'blog') {
        blogSection.classList.remove('hidden');
        uiSection.classList.add('hidden');
        blogButton.classList.replace('bg-gray-700', 'bg-orange-600');
        uiButton.classList.replace('bg-orange-600', 'bg-gray-700');
    } else if (tab === 'ui') {
        // Load the UI content before showing the editor
        showUIContentEditor(); 
        blogSection.classList.add('hidden');
        uiSection.classList.remove('hidden');
        uiButton.classList.replace('bg-gray-700', 'bg-orange-600');
        blogButton.classList.replace('bg-orange-600', 'bg-gray-700');
    }
}

function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        // Clear Blog form when opening
        document.getElementById('post-id').value = '';
        document.getElementById('post-title-en').value = '';
        document.getElementById('post-title-ar').value = '';
        document.getElementById('post-desc-en').value = '';
        document.getElementById('post-desc-ar').value = '';
        document.getElementById('post-content').value = '';
        document.getElementById('admin-status').textContent = '';
        
        // Default to showing the Blog Manager on open
        switchAdminTab('blog'); 
    }
}
function hideAdminPanel() {
    document.getElementById('admin-panel').classList.add('hidden');
}


// ---------------------------------------------
// Contact Form Handling (FormSubmit)
// ---------------------------------------------

async function handleContactSubmit(event) {
    event.preventDefault(); 
    
    const form = event.target;
    const statusDiv = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');
    
    const originalButtonText = submitButton.innerHTML;
    
    submitButton.disabled = true;
    submitButton.innerHTML = (currentLang === 'ar') ? 'جاري الإرسال...' : 'Sending...';
    statusDiv.classList.remove('visible'); 

    try {
        const formData = new FormData(form);
        const queryParams = new URLSearchParams(formData).toString();
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: queryParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.ok) {
            // FormSubmit typically redirects (status 302 or similar) on success
            form.reset();
            statusDiv.textContent = (currentLang === 'ar') ? 'تم إرسال رسالتك بنجاح. يرجى مراجعة بريدك الإلكتروني للتأكيد!' : 'Message sent successfully. Please check your email to confirm!';
            statusDiv.className = 'success';
        } else {
            statusDiv.textContent = (currentLang === 'ar') ? 'حدث خطأ في الإرسال. يرجى المحاولة لاحقاً.' : 'An error occurred during submission. Please try again later.';
            statusDiv.className = 'error';
        }

    } catch (error) {
        console.error("Form submission error:", error);
        statusDiv.textContent = (currentLang === 'ar') ? 'حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.' : 'Connection error. Please check your internet connection.';
        statusDiv.className = 'error';
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        statusDiv.style.display = 'block';
        statusDiv.classList.add('visible');
    }
}


// ---------------------------------------------
// UI & Event Listeners Setup
// ---------------------------------------------

function openLoginModal() {
    document.getElementById('login-modal').classList.add('show');
}

function closeLoginModal() {
    const loginSubmitButton = document.getElementById('login-submit');

    document.getElementById('login-modal').classList.remove('show');
    document.getElementById('login-status').textContent = '';
    
    // FIX: Clear the email and password fields too
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';

    // FIX: Reset the button state and text in case it was stuck on 'Checking...'
    if (loginSubmitButton) {
         loginSubmitButton.disabled = false;
         loginSubmitButton.textContent = (currentLang === 'ar') ? 'تسجيل الدخول' : 'Login'; 
    }
}

async function handleAdminToggle() {
    const adminButton = document.getElementById('admin-toggle-button');
    adminButton.disabled = true;
    
    // Check if the user is currently logged in as admin
    if (auth.currentUser && auth.currentUser.email === ADMIN_EMAIL) {
        const panel = document.getElementById('admin-panel');
        
        if (panel && !panel.classList.contains('hidden')) {
            // Case 1: Panel is visible -> User clicked to toggle panel view (hide/show)
            toggleAdminPanel();
            adminButton.disabled = false;
        } else {
            // Case 2: User is logged in, and panel is hidden -> User clicked to LOGOUT
            try {
                adminButton.textContent = (currentLang === 'ar') ? 'جاري الخروج...' : 'Logging out...'; 
                
                // IMPORTANT: Use signOut to explicitly terminate the session
                await signOut(auth);
                
                // onAuthStateChanged listener handles UI update and button re-enabling
            } catch (e) {
                console.error("Logout failed:", e);
                alert((currentLang === 'ar') ? 'فشل تسجيل الخروج. يرجى مراجعة الـ Console.' : 'Logout failed. Check console.');
                // Revert button state if logout fails
                adminButton.textContent = content[currentLang].admin_login_btn_logged_in;
                adminButton.disabled = false; 
            }
        }
    } else {
        // Case 3: Not logged in -> Show Login Modal
        openLoginModal();
        adminButton.disabled = false;
    }
}

async function handleLoginSubmit() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const loginStatus = document.getElementById('login-status');
    const loginSubmitButton = document.getElementById('login-submit');
    
    loginStatus.textContent = ''; // Clear previous error

    // FIX: This section ensures the button resets if fields are empty
    if (!email || !password) {
        loginStatus.textContent = content[currentLang].admin_unauthorized_msg; // Use generic unauthorized msg
        loginSubmitButton.textContent = (currentLang === 'ar') ? 'تسجيل الدخول' : 'Login'; 
        loginSubmitButton.disabled = false;
        return;
    }
    
    if (email !== ADMIN_EMAIL) {
        loginStatus.textContent = content[currentLang].admin_unauthorized_msg;
        loginSubmitButton.textContent = (currentLang === 'ar') ? 'تسجيل الدخول' : 'Login'; 
        loginSubmitButton.disabled = false;
        return;
    }
    
    const originalText = loginSubmitButton.textContent;
    loginSubmitButton.disabled = true;
    loginSubmitButton.textContent = (currentLang === 'ar') ? 'جاري التحقق...' : 'Checking...';

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Success is handled by onAuthStateChanged -> closeLoginModal
    } catch (error) {
        console.error("Login failed:", error);
        loginStatus.textContent = content[currentLang].admin_unauthorized_msg; 
        loginSubmitButton.textContent = originalText;
        loginSubmitButton.disabled = false;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initFirebase(); // Initialize Firebase
    
    // 1. Language and Menu Toggles
    document.getElementById('menu-button')?.addEventListener('click', toggleMenu);
    document.getElementById('lang-toggle-button')?.addEventListener('click', toggleLanguage);
    setLanguage("en"); // Set initial language

    // 2. Admin/Login Functionality
    document.getElementById('admin-toggle-button')?.addEventListener('click', handleAdminToggle);
    document.getElementById('login-cancel')?.addEventListener('click', closeLoginModal);
    document.getElementById('login-submit')?.addEventListener('click', handleLoginSubmit);
    
    // 3. Blog & UI Admin Functions
    document.getElementById('save-btn')?.addEventListener('click', savePost);
    document.getElementById('hide-admin')?.addEventListener('click', hideAdminPanel);
    document.getElementById('back-to-list')?.addEventListener('click', hideFullPost);
    
    // New UI Content Save Button
    document.getElementById('save-ui-btn')?.addEventListener('click', saveUIContent);
    
    // 4. Contact Form
    document.getElementById('contact-form')?.addEventListener('submit', handleContactSubmit);
});

// Expose global functions (Needed since main.js is a module)
window.savePost = savePost;
window.deletePost = deletePost;
window.editPost = editPost;
window.showFullPost = showFullPost;
window.hideFullPost = hideFullPost;
window.toggleAdminPanel = toggleAdminPanel;
window.setLanguage = setLanguage;
window.handleAdminToggle = handleAdminToggle;
window.toggleMenu = toggleMenu; 
window.closeLoginModal = closeLoginModal;
window.openLoginModal = openLoginModal;
window.switchAdminTab = switchAdminTab; // New global function for admin tabs
window.saveUIContent = saveUIContent; // New global function for saving UI content

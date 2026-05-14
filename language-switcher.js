// Comprehensive Language Switcher for ClickICT
// Automatically translates all website content to 4 languages

// Translation Database
const translations = {
    // Navigation & Header
    'home': {
        'om': 'Home',
        'am': 'ቤት',
        'en': 'Home',
        'ar': 'الرئيسية'
    },
    'kompitara': {
        'om': 'Kompitara',
        'am': 'ኮምፒዩተር',
        'en': 'Computer',
        'ar': 'الحاسوب'
    },
    'bilbila': {
        'om': 'Bilbila',
        'am': 'ስልክ',
        'en': 'Mobile',
        'ar': 'الهاتف'
    },
    'teeknoloojii': {
        'om': 'Teeknoloojii',
        'am': 'ቴክኖሎጂ',
        'en': 'Technology',
        'ar': 'التكنولوجيا'
    },
    'ai': {
        'om': 'AI',
        'am': 'AI',
        'en': 'AI',
        'ar': 'الذكاء الاصطناعي'
    },
    'social-media': {
        'om': 'Social Media',
        'am': 'ማህበራዊ ሚዲያ',
        'en': 'Social Media',
        'ar': 'وسائل التواصل'
    },
    'videos': {
        'om': 'Videos',
        'am': 'ቪዲዮዎች',
        'en': 'Videos',
        'ar': 'مقاطع الفيديو'
    },
    'gallery': {
        'om': 'Gallery',
        'am': 'ማዕከለ ስዕላት',
        'en': 'Gallery',
        'ar': 'معرض الصور'
    },
    'about-us': {
        'om': 'About Us',
        'am': 'ስለ እኛ',
        'en': 'About Us',
        'ar': 'من نحن'
    },
    'login': {
        'om': 'Login',
        'am': 'ግባ',
        'en': 'Login',
        'ar': 'تسجيل الدخول'
    },
    
    // Main Content
    'welcome-title': {
        'om': 'Baga Nagaan Dhuftan!!',
        'am': 'እንኳን ደህና መጡ!!',
        'en': 'Welcome!!',
        'ar': 'أهلاً وسهلاً!!'
    },
    'welcome-description': {
        'om': 'ClickICT - Maarsariitii ClickICT Xiyyeeffanno isaa barnoota Teknolojii kanneen akka Kompitaraa, Bilbilaa, Sammuu Nam-tolchee Afaan Oromoo,Arabiffa,English fi Afaan Amaariffaa kan beektanutti jijjiirachuun barachuu dandeessu.',
        'am': 'ClickICT - የClickICT ድህረ ገጽ እንደ ኮምፒዩተር፣ ሞባይል፣ አርቲፊሻል ኢንተለጀንስ ያሉ የቴክኖሎጂ ትምህርቶችን በአማርኛ፣ በአረብኛ፣ በእንግሊዝኛ እና በኦሮምኛ ቋንቋዎች መማር የሚችሉበት ድህረ ገጽ ነው።',
        'en': 'ClickICT - A website where you can learn technology subjects like Computer, Mobile, Artificial Intelligence in Oromo, Amharic, English and Arabic languages.',
        'ar': 'ClickICT - موقع يمكنكم من خلاله تعلم التكنولوجيا مثل الحاسوب والهاتف المحمول والذكاء الاصطناعي باللغات الأورومية والأمهرية والإنجليزية والعربية.'
    },
    'slideshow-title': {
        'om': 'Qaamolee Koompitaraa',
        'am': 'የኮምፒዩተር ክፍሎች',
        'en': 'Computer Components',
        'ar': 'مكونات الحاسوب'
    },
    
    // Features Section
    'features-title': {
        'om': 'Barnoota Kompitaraa fi Teeknolojiin wal qabatan baradhaa?',
        'am': 'የኮምፒዩተር እና ቴክኖሎጂ ትምህርቶችን መማር ይፈልጋሉ?',
        'en': 'Want to learn Computer and Technology related subjects?',
        'ar': 'هل تريد تعلم مواضيع الحاسوب والتكنولوجيا؟'
    },
    'kompitara-desc': {
        'om': 'Qaama(Hardware), Moosaajii(software) fi Suphaa(troubleshooting) kompitaraa afaan Oromootiin baradhaa',
        'am': 'የኮምፒዩተር ሃርድዌር፣ ሶፍትዌር እና ችግር መፍታት በአማርኛ ይማሩ',
        'en': 'Learn Computer Hardware, Software and Troubleshooting in English',
        'ar': 'تعلم أجهزة الحاسوب والبرمجيات وحل المشاكل باللغة العربية'
    },
    'bilbila-desc': {
        'om': 'Bilbila suphaa, Appii fi koodii dhoksaa barachuu fi fayyadamuu ni dandeessu',
        'am': 'የስልክ መጠገን፣ መተግበሪያዎች እና ሚስጥራዊ ኮዶች መማር እና መጠቀም ይችላሉ',
        'en': 'Learn and use mobile repair, apps and secret codes',
        'ar': 'تعلم واستخدم إصلاح الهواتف والتطبيقات والرموز السرية'
    },
    'teeknoloojii-desc': {
        'om': 'Oduu teeknoloojii Addunyaa fi miseensummaa haaraa online barachuu yoo barbaaddan galmaa\'aa',
        'am': 'የዓለም ቴክኖሎጂ ዜናዎች እና አዲስ የመስመር ላይ አባልነት ለመማር ከፈለጉ ይመዝገቡ',
        'en': 'Register if you want to learn world technology news and new online membership',
        'ar': 'سجل إذا كنت تريد تعلم أخبار التكنولوجيا العالمية والعضوية الجديدة عبر الإنترنت'
    },
    
    // Recent Posts
    'recent-posts': {
        'om': 'Barreeffamoota Haaraa',
        'am': 'አዲስ ጽሑፎች',
        'en': 'Recent Posts',
        'ar': 'المنشورات الحديثة'
    },
    'pinned-posts': {
        'om': 'Barreeffamoota Filatamoo',
        'am': 'የተመረጡ ጽሑፎች',
        'en': 'Featured Posts',
        'ar': 'المنشورات المميزة'
    },
    
    // Page Headers
    'kompitara-header': {
        'om': 'Hardware, Software fi Troubleshooting Kompitaraa Afaan Oromootiin',
        'am': 'የኮምፒዩተር ሃርድዌር፣ ሶፍትዌር እና ችግር መፍታት በአማርኛ',
        'en': 'Computer Hardware, Software and Troubleshooting in English',
        'ar': 'أجهزة الحاسوب والبرمجيات وحل المشاكل باللغة العربية'
    },
    'bilbila-header': {
        'om': 'Bilbila Suphaa, Appii fi Koodii Dhoksaa',
        'am': 'የስልክ መጠገን፣ መተግበሪያዎች እና ሚስጥራዊ ኮዶች',
        'en': 'Mobile Repair, Apps and Secret Codes',
        'ar': 'إصلاح الهواتف والتطبيقات والرموز السرية'
    },
    'teeknoloojii-header': {
        'om': 'Oduu Teeknoloojii Addunyaa fi Miseensummaa Online',
        'am': 'የዓለም ቴክኖሎጂ ዜናዎች እና የመስመር ላይ አባልነት',
        'en': 'World Technology News and Online Membership',
        'ar': 'أخبار التكنولوجيا العالمية والعضوية عبر الإنترنت'
    },
    
    // Form Labels
    'fullname': {
        'om': 'Maqaa Guutuu',
        'am': 'ሙሉ ስም',
        'en': 'Full Name',
        'ar': 'الاسم الكامل'
    },
    'email': {
        'om': 'Email',
        'am': 'ኢሜይል',
        'en': 'Email',
        'ar': 'البريد الإلكتروني'
    },
    'username': {
        'om': 'Maqaa Fayyadamaa',
        'am': 'የተጠቃሚ ስም',
        'en': 'Username',
        'ar': 'اسم المستخدم'
    },
    'password': {
        'om': 'Jecha Icciitii',
        'am': 'የይለፍ ቃል',
        'en': 'Password',
        'ar': 'كلمة المرور'
    },
    'register': {
        'om': 'Galmaa\'i',
        'am': 'ይመዝገቡ',
        'en': 'Register',
        'ar': 'سجل'
    },
    'submit': {
        'om': 'Ergi',
        'am': 'ላክ',
        'en': 'Submit',
        'ar': 'إرسال'
    },
    
    // Comments
    'comments': {
        'om': 'Yaadoota',
        'am': 'አስተያየቶች',
        'en': 'Comments',
        'ar': 'التعليقات'
    },
    'add-comment': {
        'om': 'Yaada Dabalaa',
        'am': 'አስተያየት ይጨምሩ',
        'en': 'Add Comment',
        'ar': 'أضف تعليق'
    },
    'your-comment': {
        'om': 'Yaada Keessan',
        'am': 'የእርስዎ አስተያየት',
        'en': 'Your Comment',
        'ar': 'تعليقك'
    },
    
    // Footer
    'footer-text': {
        'om': '© 2024 ClickICT. Mirgi hundi eegameera.',
        'am': '© 2024 ClickICT. ሁሉም መብቶች የተጠበቁ ናቸው።',
        'en': '© 2024 ClickICT. All rights reserved.',
        'ar': '© 2024 ClickICT. جميع الحقوق محفوظة.'
    },
    
    // Additional UI Elements
    'all-videos': {
        'om': 'Videos Hunda',
        'am': 'ሁሉም ቪዲዮዎች',
        'en': 'All Videos',
        'ar': 'جميع مقاطع الفيديو'
    },
    'featured-videos': {
        'om': 'Videos Filatamoo',
        'am': 'የተመረጡ ቪዲዮዎች',
        'en': 'Featured Videos',
        'ar': 'مقاطع الفيديو المميزة'
    },
    'all-images': {
        'om': 'Suuraa Hunda',
        'am': 'ሁሉም ስዕሎች',
        'en': 'All Images',
        'ar': 'جميع الصور'
    },
    'featured-images': {
        'om': 'Suuraa Filatamoo',
        'am': 'የተመረጡ ስዕሎች',
        'en': 'Featured Images',
        'ar': 'الصور المميزة'
    },
    'watch-video': {
        'om': 'Video Ilaalaa',
        'am': 'ቪዲዮ ይመልከቱ',
        'en': 'Watch Video',
        'ar': 'شاهد الفيديو'
    },
    'view-image': {
        'om': 'Suuraa Ilaalaa',
        'am': 'ስዕል ይመልከቱ',
        'en': 'View Image',
        'ar': 'عرض الصورة'
    },
    'read-more': {
        'om': 'Dabalata Dubbisaa',
        'am': 'ተጨማሪ ያንብቡ',
        'en': 'Read More',
        'ar': 'اقرأ المزيد'
    },
    'follow-us': {
        'om': 'Nu Hordofaa',
        'am': 'ይከተሉን',
        'en': 'Follow Us',
        'ar': 'تابعنا'
    },
    'education': {
        'om': 'Barnoota',
        'am': 'ትምህርት',
        'en': 'Education',
        'ar': 'التعليم'
    },
    'about': {
        'om': 'Waa\'ee Keenya',
        'am': 'ስለ እኛ',
        'en': 'About',
        'ar': 'حول'
    }
};

// Language Switcher Class
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = localStorage.getItem('clickict_language') || 'om';
        this.init();
    }

    init() {
        // Don't create a new selector, use the existing one in HTML
        this.translatePage();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Use the existing language selector from HTML navigation
        const languageSelect = document.getElementById('language-switcher');
        if (languageSelect) {
            // Set the initial value to match stored language
            languageSelect.value = this.currentLanguage;
            
            // Listen for changes
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    }

    changeLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('clickict_language', language);
        this.translatePage();
        
        // Update document direction for Arabic
        if (language === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = language;
        }
    }

    translatePage() {
        // Translate elements with data-translate attribute
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key] && translations[key][this.currentLanguage]) {
                element.textContent = translations[key][this.currentLanguage];
            }
        });

        // Translate placeholder attributes
        const elementsWithPlaceholder = document.querySelectorAll('[data-translate-placeholder]');
        
        elementsWithPlaceholder.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[key] && translations[key][this.currentLanguage]) {
                element.placeholder = translations[key][this.currentLanguage];
            }
        });

        // Auto-translate common elements by their content
        this.autoTranslateCommonElements();
    }

    autoTranslateCommonElements() {
        // Auto-translate navigation links
        const navLinks = document.querySelectorAll('nav a, .nav-menu a');
        navLinks.forEach(link => {
            const text = link.textContent.trim().toLowerCase();
            const key = this.findTranslationKey(text);
            if (key && translations[key] && translations[key][this.currentLanguage]) {
                link.textContent = translations[key][this.currentLanguage];
            }
        });

        // Auto-translate buttons
        const buttons = document.querySelectorAll('button, input[type="submit"]');
        buttons.forEach(button => {
            const text = button.textContent.trim().toLowerCase();
            const key = this.findTranslationKey(text);
            if (key && translations[key] && translations[key][this.currentLanguage]) {
                button.textContent = translations[key][this.currentLanguage];
            }
        });

        // Auto-translate headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const text = heading.textContent.trim().toLowerCase();
            const key = this.findTranslationKey(text);
            if (key && translations[key] && translations[key][this.currentLanguage]) {
                heading.textContent = translations[key][this.currentLanguage];
            }
        });
    }

    findTranslationKey(text) {
        // Find translation key by matching text content
        for (const key in translations) {
            for (const lang in translations[key]) {
                if (translations[key][lang].toLowerCase() === text) {
                    return key;
                }
            }
        }
        return null;
    }

    // Method to add new translations dynamically
    addTranslation(key, translations) {
        if (!this.translations[key]) {
            this.translations[key] = {};
        }
        Object.assign(this.translations[key], translations);
    }

    // Method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Method to get translation for a specific key
    getTranslation(key) {
        if (translations[key] && translations[key][this.currentLanguage]) {
            return translations[key][this.currentLanguage];
        }
        return key; // Return key if translation not found
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageSwitcher, translations };
}
// 1. IMPORT SUPABASE
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. YOUR SECRET KEYS
const supabaseUrl = 'https://jhjmlarluvpvxrvflcou.supabase.co'
const supabaseKey = 'sb_publishable_fQwKeXocOxtX82bkLGJy8Q_tSqPZwhp'
const supabase = createClient(supabaseUrl, supabaseKey)

// 👑 THE MASTER ADMIN EMAIL (FOUNDER)
const ADMIN_EMAIL = "dharamkarate108@gmail.com"; 

// 🛡️ SECURE MODULE VARIABLES
let IS_FOUNDER = false;
let IS_ADMIN = false;
let ADMIN_ROSTER = [];
let replyingToCommentId = null; // Tracks if a user is replying to a specific comment
console.log("Tea House connected to the Warehouse! ☕");

/* --- 🌟 1. CUSTOM NATIVE MODALS --- */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('custom-modal-overlay')) {
        const modalHTML = `
        <div id="custom-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:100000; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
            <div class="matte-card" style="width: 90%; max-width: 400px; text-align: center; padding: 30px; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); animation: fadeIn 0.3s ease; background: #161b22; border: 1px solid #30363d;">
                <h3 id="custom-modal-title" style="color: #1f6feb; margin-bottom: 15px; font-family: 'Oswald'; font-size: 1.5rem; text-transform: uppercase;">Notice</h3>
                <div id="custom-modal-message" style="color: #c9d1d9; margin-bottom: 20px; font-size: 0.95rem; line-height: 1.5; font-family: -apple-system, sans-serif;"></div>
                <div id="custom-modal-inputs" style="display:none; flex-direction:column; gap:12px; margin-bottom: 25px;"></div>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="custom-modal-cancel" class="admin-btn admin-btn-action" style="display:none; padding: 10px 20px;">Cancel</button>
                    <button id="custom-modal-confirm" class="admin-btn admin-btn-safe" style="padding: 10px 20px;">OK</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});

window.customAlert = (msg, title = "Notice", isError = false) => {
    document.getElementById('custom-modal-title').innerText = title;
    document.getElementById('custom-modal-title').style.color = isError ? '#e74c3c' : '#1f6feb';
    document.getElementById('custom-modal-message').innerHTML = msg;
    document.getElementById('custom-modal-inputs').style.display = 'none';
    document.getElementById('custom-modal-cancel').style.display = 'none';
    const confirmBtn = document.getElementById('custom-modal-confirm');
    confirmBtn.innerText = "OK";
    confirmBtn.className = isError ? 'admin-btn admin-btn-danger' : 'admin-btn admin-btn-safe';
    confirmBtn.onclick = () => document.getElementById('custom-modal-overlay').style.display = 'none';
    document.getElementById('custom-modal-overlay').style.display = 'flex';
};

window.customConfirm = (msg, onConfirm, onCancel = null, title = "Warning", confirmText = "Proceed", isDanger = false) => {
    document.getElementById('custom-modal-title').innerText = title;
    document.getElementById('custom-modal-title').style.color = isDanger ? '#e74c3c' : '#d29922';
    document.getElementById('custom-modal-message').innerHTML = msg;
    document.getElementById('custom-modal-inputs').style.display = 'none';
    const cancelBtn = document.getElementById('custom-modal-cancel');
    cancelBtn.style.display = 'inline-block';
    cancelBtn.onclick = () => { document.getElementById('custom-modal-overlay').style.display = 'none'; if (onCancel) onCancel(); };
    const confirmBtn = document.getElementById('custom-modal-confirm');
    confirmBtn.innerText = confirmText;
    confirmBtn.className = isDanger ? 'admin-btn admin-btn-danger' : 'admin-btn admin-btn-safe';
    confirmBtn.onclick = () => { document.getElementById('custom-modal-overlay').style.display = 'none'; onConfirm(); };
    document.getElementById('custom-modal-overlay').style.display = 'flex';
};

window.customPrompt = (msg, placeholder, onConfirm, title = "Input Required", defaultVal = "") => {
    document.getElementById('custom-modal-title').innerText = title;
    document.getElementById('custom-modal-title').style.color = '#1f6feb';
    document.getElementById('custom-modal-message').innerHTML = msg;
    const inputsDiv = document.getElementById('custom-modal-inputs');
    inputsDiv.style.display = 'flex';
    inputsDiv.innerHTML = `<input type="text" id="prompt-val-1" placeholder="${placeholder}" value="${defaultVal}" style="width:100%; padding:12px; background:#0d1117; border:1px solid #30363d; color:#c9d1d9; border-radius:6px; outline:none; font-family: inherit;" />`;
    const cancelBtn = document.getElementById('custom-modal-cancel');
    cancelBtn.style.display = 'inline-block';
    cancelBtn.onclick = () => document.getElementById('custom-modal-overlay').style.display = 'none';
    const confirmBtn = document.getElementById('custom-modal-confirm');
    confirmBtn.innerText = "Submit";
    confirmBtn.className = 'admin-btn admin-btn-safe';
    confirmBtn.onclick = () => { 
        const val = document.getElementById('prompt-val-1').value.trim();
        if(val) { document.getElementById('custom-modal-overlay').style.display = 'none'; onConfirm(val); } 
        else { document.getElementById('prompt-val-1').style.borderColor = '#e74c3c'; }
    };
    document.getElementById('custom-modal-overlay').style.display = 'flex';
    setTimeout(() => document.getElementById('prompt-val-1').focus(), 100);
};

window.customDoublePrompt = (msg, ph1, ph2, onConfirm, title = "Input Required", def1 = "", def2 = "") => {
    document.getElementById('custom-modal-title').innerText = title;
    document.getElementById('custom-modal-title').style.color = '#1f6feb';
    document.getElementById('custom-modal-message').innerHTML = msg;
    const inputsDiv = document.getElementById('custom-modal-inputs');
    inputsDiv.style.display = 'flex';
    inputsDiv.innerHTML = `
        <input type="text" id="prompt-val-1" placeholder="${ph1}" value="${def1}" style="width:100%; padding:12px; background:#0d1117; border:1px solid #30363d; color:#c9d1d9; border-radius:6px; outline:none; font-family: inherit;" />
        <input type="text" id="prompt-val-2" placeholder="${ph2}" value="${def2}" style="width:100%; padding:12px; background:#0d1117; border:1px solid #30363d; color:#c9d1d9; border-radius:6px; outline:none; font-family: inherit;" />
    `;
    const cancelBtn = document.getElementById('custom-modal-cancel');
    cancelBtn.style.display = 'inline-block';
    cancelBtn.onclick = () => document.getElementById('custom-modal-overlay').style.display = 'none';
    const confirmBtn = document.getElementById('custom-modal-confirm');
    confirmBtn.innerText = "Submit";
    confirmBtn.className = 'admin-btn admin-btn-safe';
    confirmBtn.onclick = () => { 
        const val1 = document.getElementById('prompt-val-1').value.trim();
        const val2 = document.getElementById('prompt-val-2').value.trim();
        if(val1 && val2) { document.getElementById('custom-modal-overlay').style.display = 'none'; onConfirm(val1, val2); } 
        else {
            if(!val1) document.getElementById('prompt-val-1').style.borderColor = '#e74c3c';
            if(!val2) document.getElementById('prompt-val-2').style.borderColor = '#e74c3c';
        }
    };
    document.getElementById('custom-modal-overlay').style.display = 'flex';
    setTimeout(() => document.getElementById('prompt-val-1').focus(), 100);
};

/* --- ENCODING HELPERS --- */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
}

function safeEncode(str) {
    if (!str) return '';
    return encodeURIComponent(str).replace(/'/g, "%27");
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
}

/* --- 2. AUTH & UI CHECK --- */
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: admins } = await supabase.from('site_admins').select('email');
    if (admins) ADMIN_ROSTER = admins.map(a => a.email);

    if (user) {
        IS_FOUNDER = (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
        IS_ADMIN = IS_FOUNDER || ADMIN_ROSTER.some(e => e.toLowerCase() === user.email.toLowerCase());

        const { data: bannedUser } = await supabase.from('banned_users').select('*').eq('user_id', user.id).maybeSingle();
        if (bannedUser) {
            window.customAlert("YOU HAVE BEEN PERMANENTLY BANNED FROM THE TEA HOUSE.", "🚨 BANNED 🚨", true);
            await supabase.auth.signOut();
            window.location.href = 'index.html';
            return; 
        }

        const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
        if (!existingProfile) {
            await supabase.from('profiles').insert({
                id: user.id, username: user.user_metadata.full_name || user.email.split('@')[0], avatar_url: user.user_metadata.custom_avatar || user.user_metadata.avatar_url
            });
        }
    }

    const topLoginBtn = document.querySelector('.login-btn'); 
    const bottomProfileBtn = document.querySelector('.nav-item[href="auth.html"], .nav-item[href="profile.html"]'); 
    const sidebarAuthBtn = document.getElementById('sidebar-auth-btn'); 

    if (user) {
        if (topLoginBtn) topLoginBtn.style.display = 'none'; 
        if (bottomProfileBtn) bottomProfileBtn.href = "profile.html";
        if (sidebarAuthBtn) {
            sidebarAuthBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> <span>Log Out</span>';
            sidebarAuthBtn.onclick = window.logoutUser;
            sidebarAuthBtn.style.color = '#ff4d4d'; 
        }
    } else {
        if (topLoginBtn) topLoginBtn.style.display = 'block';
        if (sidebarAuthBtn) {
            sidebarAuthBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Login / Sign Up</span>';
            sidebarAuthBtn.onclick = () => window.location.href = 'auth.html';
        }
    }
}

window.loginWithGoogle = async () => {
    // Automatically figures out if you are on localhost or GitHub Pages
    let baseUrl = window.location.href.split('/auth.html')[0];
    
    const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { redirectTo: baseUrl + '/lounge.html' } 
    });
    if (error) window.customAlert("Google Login Error: " + error.message, "Error", true);
};

const authForm = document.getElementById('auth-form');
const toggleAuth = document.getElementById('toggle-auth');
const authTitle = document.getElementById('auth-title');

if (toggleAuth && authTitle) {
    toggleAuth.addEventListener('click', () => {
        const isLogin = authTitle.innerText.includes('LOGIN');
        authTitle.innerText = isLogin ? 'SIGN UP NOW !' : 'LOGIN NOW !';
        toggleAuth.innerText = isLogin ? 'New here? Create an account' : 'Already have an account? Login';
    });
}

if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isSignUp = authTitle.innerText.includes('SIGN UP');
        const submitBtn = document.querySelector('.auth-submit');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Processing... ⏳";

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) { window.customAlert("Sign up failed: " + error.message, "Error", true); } 
            else { 
                window.customAlert("Account created! Check your email to verify.", "Verify Email");
                document.getElementById('email').value = ''; document.getElementById('password').value = '';
                document.getElementById('toggle-auth').click(); 
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { window.customAlert("Login failed: " + error.message, "Error", true); } 
            else { window.location.href = 'lounge.html'; }
        }
        submitBtn.innerText = originalText;
    });
}

/* --- 3. DYNAMIC CATEGORIES --- */
async function initGlobalCategories() {
    const { data: categories } = await supabase.from('categories').select('*').order('id', { ascending: true });
    const genreNav = document.querySelector('.genre-nav');
    if (genreNav && categories) {
        genreNav.innerHTML = categories.map((cat, index) => `<li><a href="#" data-genre="${cat.slug}" class="${index === 0 ? 'active' : ''}">${escapeHTML(cat.name)}</a></li>`).join('');
        
        const genreButtons = document.querySelectorAll('.genre-nav li a');
        genreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedGenre = button.getAttribute('data-genre');
                if (selectedGenre === 'chatpati' || selectedGenre.includes('18+')) {
                    window.customConfirm("This section contains 18+ content. Proceed?", 
                        () => {
                            genreButtons.forEach(btn => btn.classList.remove('active'));
                            button.classList.add('active');
                            loadTeaFeed(selectedGenre);
                        }, () => {}, "Age Restriction", "Enter 18+", true 
                    ); return;
                }
                genreButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                loadTeaFeed(selectedGenre);
            });
        });
    }

    const genreSelect = document.getElementById('genre');
    if (genreSelect && categories) {
        genreSelect.innerHTML = categories.map(cat => `<option value="${cat.slug}">${cat.emoji} ${escapeHTML(cat.name)}</option>`).join('');
    }
}

/* --- 4. SPILL TEA LOGIC --- */
const teaForm = document.getElementById('tea-form');
if (teaForm) {
    teaForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!IS_ADMIN && !IS_FOUNDER && user) {
            const now = Date.now();
            const penaltyTimeout = localStorage.getItem('penaltyTimeout_' + user.id);
            const lastPostTime = localStorage.getItem('lastPostTime_' + user.id);
            
            if (penaltyTimeout && now < penaltyTimeout) return window.customAlert(`SPAM PENALTY: You are in timeout!`, "Timeout", true);
            if (lastPostTime && (now - lastPostTime) < (20 * 60 * 1000)) { 
                localStorage.setItem('penaltyTimeout_' + user.id, now + (12 * 60 * 60 * 1000));
                return window.customAlert("SLOW DOWN! 12-HOUR timeout for spamming!", "Warning", true);
            }
        }

        const submitBtn = document.getElementById('submit-tea');
        submitBtn.innerText = "UPLOADING TEA... ⏳";

        const category = document.getElementById('genre').value;
        const content = document.getElementById('tea-content').value;
        const username = user ? (user.user_metadata.full_name || user.email.split('@')[0]) : "Anonymous Spiller";

        let finalImageUrls = []; 
        const mediaInput = document.getElementById('media-upload');
        if (mediaInput && mediaInput.files.length > 0) {
            for (let i = 0; i < mediaInput.files.length; i++) {
                const file = mediaInput.files[i];
                if (file.size > 50 * 1024 * 1024) return window.customAlert(`File too large!`, "Error", true);
                const fileName = `${Date.now()}-${i}.${file.name.split('.').pop()}`; 
                const { error: uploadError } = await supabase.storage.from('tea-attachments').upload(fileName, file);
                if (!uploadError) finalImageUrls.push(supabase.storage.from('tea-attachments').getPublicUrl(fileName).data.publicUrl); 
            }
        }
        
        const { error } = await supabase.from('Post').insert([{ username, content, category, user_id: user?.id, image_url: finalImageUrls.length > 0 ? finalImageUrls.join(',') : null, upvotes: 0, downvotes: 0 }]);
        if (error) { 
            window.customAlert("Spillage failed! " + error.message, "Error", true);
            submitBtn.innerText = "POST TO THE LOUNGE"; 
        } else { 
            if (user && !IS_ADMIN) localStorage.setItem('lastPostTime_' + user.id, Date.now()); 
            window.customAlert("Your Tea has been spilled to the Lounge! ☕", "Success");
            setTimeout(() => { window.location.href = 'lounge.html'; }, 1500); 
        }
    });
}

/* --- 5. FETCHING LIVE FEED --- */
async function loadTeaFeed(filter = 'trending') {
    const feedContainer = document.getElementById('tea-feed');
    if (!feedContainer) return;
    feedContainer.innerHTML = `<div id="loading-tea" style="text-align: center; margin-top: 50px; color: var(--neon-blue);"><p style="font-family: 'Oswald'; letter-spacing: 2px;">POURING THE TEAS... ☕</p></div>`;

    try {
        let query = supabase.from('Post').select('*').order('created_at', { ascending: false });
        if (filter !== 'trending') query = query.eq('category', filter);
        const { data: posts, error } = await query;
        if (error) throw error;

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        feedContainer.innerHTML = ''; 

        if (posts && posts.length > 0) {
            let allCards = ""; 
            posts.forEach(post => {
                const isLong = (post.content || "").length > 200;
                const displayContent = isLong ? post.content.substring(0, 200) + "..." : post.content;
                let mediaIndicator = '';
                if (post.image_url) {
                    const urls = post.image_url.split(','); 
                    mediaIndicator = `<button onclick="openFullTea(${post.id})" class="read-btn" style="color: var(--gold); margin-top: 10px; display: block; width: 100%; text-align: left;">📸 VIEW ATTACHMENTS (${urls.length}) →</button>`;
                }
                const readMoreBtn = (isLong && !post.image_url) ? `<button onclick="openFullTea(${post.id})" class="read-btn" style="margin-top: 10px;">READ FULL STORY →</button>` : '';

                let deleteBtnHTML = '';
                if (currentUser && (post.user_id === currentUser.id || IS_ADMIN || IS_FOUNDER)) {
                    deleteBtnHTML = `<button onclick="deleteTea(${post.id})" class="delete-btn">🗑️</button>`;
                }

                const safeName = escapeHTML(post.username || "Anonymous");
                let badgeHTML = "";
                if (currentUser && post.user_id === currentUser.id) {
                    if (IS_FOUNDER) { badgeHTML = ' <span title="Founder" style="font-size:1.2rem; filter: drop-shadow(0 0 5px var(--none));">🗿</span>'; } 
                    else if (IS_ADMIN) { badgeHTML = ' <span title="Moderator" style="font-size:1rem;">🚬</span>'; }
                }
                
                const finalDisplayName = `${safeName}${badgeHTML}`;
                const timeString = post.created_at ? timeAgo(post.created_at) : '';
                const userLink = post.user_id ? `<a href="user.html?id=${post.user_id}" style="color: var(--gold); text-decoration: none;">${finalDisplayName}</a>` : finalDisplayName;

                const userVote = currentUser ? localStorage.getItem(`voted-${post.id}-${currentUser.id}`) : null;
                const upClass = userVote === 'up' ? 'style="color: var(--neon-pink); border-color: var(--neon-pink);"' : '';
                const downClass = userVote === 'down' ? 'style="color: var(--neon-blue); border-color: var(--neon-blue);"' : '';

                allCards += `
                    <article class="tea-card" id="tea-${post.id}">
                        <div class="card-header" style="display: flex; justify-content: space-between;">
                            <span class="username" style="pointer-events: auto;">${userLink} <span style="font-size:0.75rem; color:#888; font-weight:normal; margin-left:8px;">${timeString}</span></span>
                            <div class="header-right"><span class="tag">#${escapeHTML(post.category)}</span>${deleteBtnHTML}</div>
                        </div>
                        <div class="card-content" style="margin-bottom: 15px;">
                            <p class="tea-text">${escapeHTML(displayContent)}</p>
                            ${mediaIndicator}${readMoreBtn}
                        </div>
                            <div class="card-footer">
                            <div class="votes">
                             <button onclick="handleVote(${post.id}, 'up')" class="vote-up" ${upClass}>☕ <span id="up-${post.id}">${post.upvotes || 0}</span></button>
                                        <button onclick="handleVote(${post.id}, 'down')" class="vote-down" ${downClass}>⬇️ <span id="down-${post.id}">${post.downvotes || 0}</span></button>
                                </div>
                                <div class="actions">
                                    <button onclick="toggleComments(${post.id})" class="comment-btn">💬</button>
                                    <button onclick="shareTea(${post.id})" class="share-btn">🔗</button>
                                    <button onclick="toggleFavourite(${post.id})" class="fav-btn" style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--glass-border); color: white; padding: 8px 12px; border-radius: 12px; cursor: pointer;">❤️</button>
                                    <button onclick="toggleSave(${post.id})" class="save-btn">🔖</button>
                                </div>
                            </div>
                        <div id="comment-section-${post.id}" style="display:none; margin-top:20px; border-top:1px solid rgba(255,255,255,0.1); padding-top:15px;">
                            <div id="comment-list-${post.id}" style="max-height:300px; overflow-y:auto; margin-bottom:15px; text-align: left;"></div>
                            <div style="display:flex; gap:10px;">
                                <input type="text" id="comment-input-${post.id}" placeholder="Write a reply..." style="flex:1; margin:0; padding:10px; border-radius:10px;">
                                <button onclick="submitComment(${post.id})" style="background:var(--neon-blue); color:white; border:none; border-radius:10px; padding:0 15px; cursor:pointer; font-family:'Oswald';">SEND</button>
                            </div>
                        </div>
                    </article>`;
            });
            feedContainer.innerHTML = allCards; 
        } else {
            feedContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:50px;">No tea spilled in this category yet. ☕</p>';
        }
    } catch (err) {
        feedContainer.innerHTML = '<p style="text-align:center; color:red; margin-top:50px;">The kettle is broken! ❌</p>';
    }
}

/* --- 6. SINGLE TEA VIEWER --- */
async function loadSingleTea() {
    const display = document.getElementById('full-tea-display');
    if (!display || !window.location.search.includes('id=')) return;
    const teaId = new URLSearchParams(window.location.search).get('id');
    const { data: post } = await supabase.from('Post').select('*').eq('id', teaId).maybeSingle();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (post) {
        post.views = (post.views || 0) + 1;
        supabase.rpc('increment_view_count', { row_id: parseInt(teaId) }).then(({error}) => { if(error) console.error(error); });

        let mediaHTML = '';
        if (post.image_url) {
            const urls = post.image_url.split(',');
            mediaHTML = `<div style="display: flex; gap: 15px; overflow-x: auto; padding: 15px 0; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">`;
            urls.forEach(url => {
                if (url.match(/\.(mp4|webm|ogg)$/i)) mediaHTML += `<video controls src="${url}" style="height: 120px; border-radius: 10px; border: 2px solid var(--neon-blue); background: #000; flex-shrink: 0;"></video>`;
                else mediaHTML += `<img src="${url}" onclick="openFullscreenImage('${url}')" style="height: 120px; width: 120px; object-fit: cover; border-radius: 10px; border: 2px solid var(--neon-blue); cursor: zoom-in; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">`;
            });
            mediaHTML += `</div>`;
        }

        let deleteBtnHTML = '';
        if (currentUser && (currentUser.id === post.user_id || IS_ADMIN || IS_FOUNDER)) {
            deleteBtnHTML = `<button onclick="deleteTea(${post.id})" class="delete-btn" style="background: none; border: none; color: red; font-size: 1.2rem; cursor: pointer;">🗑️</button>`;
        }
        
        let badgeHTML = "";
        if (currentUser && post.user_id === currentUser.id) {
            if (IS_FOUNDER) { badgeHTML = ' <span title="Founder" style="font-size:1.2rem;">👑</span>'; } 
            else if (IS_ADMIN) { badgeHTML = ' <span title="Moderator" style="font-size:1rem;">🚬</span>'; }
        }

        const safeName = escapeHTML(post.username) + badgeHTML;
        const userLink = post.user_id ? `<a href="user.html?id=${post.user_id}" style="color: var(--gold); text-decoration: none;">${safeName}</a>` : safeName;

        display.innerHTML = `
            <div class="card-header" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <span class="username" style="font-size: 1.8rem; color: var(--gold); pointer-events: auto;">${userLink} <span style="font-size:0.9rem; color:#888; margin-left:10px;">${timeAgo(post.created_at)}</span></span>
                <div style="display: flex; align-items: center; gap: 10px;"><span class="tag">#${escapeHTML(post.category)}</span>${deleteBtnHTML}</div>
            </div>
            <div class="card-content">
                <p style="font-size: 1.3rem; line-height: 1.7; white-space: pre-wrap;">${escapeHTML(post.content)}</p>
                ${mediaHTML}
            </div>
            <div class="card-footer" style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; display: flex; gap: 20px;">
                 <span style="color: var(--neon-pink); font-weight: bold;">☕ ${post.upvotes || 0} Votes</span>
                 <span style="color: var(--neon-blue); font-weight: bold;"><i class="fas fa-eye"></i> ${post.views || 0} Views</span>
            </div>
        `;
    }
}

window.logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { window.customAlert("Error logging out: " + error.message, "Error", true); } 
    else { window.location.href = 'index.html'; } 
};

window.resetTranslation = () => {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;
    window.location.reload();
};

/* --- 7. GLOBAL HELPERS & COMMENTS --- */
window.toggleSave = async (postId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.customAlert("You must be logged in to save tea!", "Notice");
    const { data: existing } = await supabase.from('saved_teas').select('*').eq('user_id', user.id).eq('post_id', postId).maybeSingle();
    if (existing) {
        await supabase.from('saved_teas').delete().eq('id', existing.id);
        window.customAlert("Removed from your Saved Stash!");
    } else {
        await supabase.from('saved_teas').insert([{ user_id: user.id, post_id: postId }]);
        window.customAlert("Added to your Saved Stash 🔖!");
    }
};

window.toggleFavourite = async (postId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.customAlert("You must be logged in to favourite tea!", "Notice");
    const { data: existing } = await supabase.from('favourite_teas').select('*').eq('user_id', user.id).eq('post_id', postId).maybeSingle();
    if (existing) {
        await supabase.from('favourite_teas').delete().eq('id', existing.id);
        window.customAlert("Removed from your Favourites!");
    } else {
        await supabase.from('favourite_teas').insert([{ user_id: user.id, post_id: postId }]);
        window.customAlert("Added to your Favourites ❤️!");
    }
};

window.openFullscreenImage = (url) => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image-content');
    if (modal && modalImg) { modalImg.src = url; modal.style.display = 'flex'; }
};

window.closeFullscreenImage = () => {
    const modal = document.getElementById('image-modal');
    if (modal) { modal.style.display = 'none'; document.getElementById('modal-image-content').src = ''; }
};

/* NESTED COMMENTS LOGIC */
window.toggleComments = async (postId) => {
    const section = document.getElementById(`comment-section-${postId}`);
    section.style.display = section.style.display === 'block' ? 'none' : 'block';
    replyingToCommentId = null; 
    document.getElementById(`comment-input-${postId}`).placeholder = "Write a reply...";
    if (section.style.display === 'block') loadComments(postId);
};

window.replyToComment = (postId, commentId, username) => {
    replyingToCommentId = commentId;
    const input = document.getElementById(`comment-input-${postId}`);
    input.placeholder = `Replying to ${username}...`;
    input.focus();
};

window.deleteComment = async (commentId, postId) => {
    window.customConfirm("Delete this comment?", async () => {
        // USING .select() helps us detect silent RLS failures
        const { data, error } = await supabase.from('Comments').delete().eq('id', commentId).select();
        
        if (error) { 
            window.customAlert("Failed to delete: " + error.message, "Error", true); 
        } else if (data && data.length === 0) {
            window.customAlert("Database security blocked this. Ensure you ran the SQL permission script!", "Blocked", true);
        } else {
            window.customAlert("Comment deleted successfully! 🗑️", "Success");
            loadComments(postId);
        }
    }, null, "Delete Comment", "Delete", true);
};

window.submitComment = async (postId) => {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;
    const { data: { user } } = await supabase.auth.getUser();
    const username = user ? (user.user_metadata.full_name || user.email.split('@')[0]) : "Anonymous User";
    
    const { error } = await supabase.from('Comments').insert([{ 
        post_id: postId, 
        username: username, 
        content: content,
        parent_id: replyingToCommentId,
        user_id: user ? user.id : null
    }]);

    if (!error) { 
        window.customAlert("Reply posted! 💬", "Success");
        input.value = ''; 
        input.placeholder = "Write a reply...";
        replyingToCommentId = null;
        loadComments(postId); 

        if (user) {
            const { data: postData } = await supabase.from('Post').select('user_id').eq('id', postId).single();
            if (postData && postData.user_id && postData.user_id !== user.id) {
                await supabase.from('notifications').insert({ recipient_id: postData.user_id, sender_id: user.id, type: 'comment', post_id: postId, message: content });
            }
        }
    } else {
        window.customAlert("Failed to post: " + error.message, "Error", true);
    }
};

async function loadComments(postId) {
    const list = document.getElementById(`comment-list-${postId}`);
    const { data: comments } = await supabase.from('Comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (comments && comments.length > 0) {
        const parents = comments.filter(c => !c.parent_id);
        const children = comments.filter(c => c.parent_id);

        let html = '';
        parents.forEach(p => {
            html += generateCommentHTML(p, currentUser, postId, false);
            const replies = children.filter(c => c.parent_id === p.id);
            replies.forEach(r => { html += generateCommentHTML(r, currentUser, postId, true); });
        });
        list.innerHTML = html;
    } else {
        list.innerHTML = '<p style="font-size:0.8rem; color:#888;">No replies yet.</p>';
    }
}

function generateCommentHTML(c, currentUser, postId, isReply) {
    let deleteBtn = '';
    if (currentUser && (c.user_id === currentUser.id || IS_ADMIN || IS_FOUNDER)) {
        deleteBtn = `<button onclick="event.stopPropagation(); window.deleteComment(${c.id}, ${postId})" style="background:none; border:none; color:red; cursor:pointer; font-size:0.9rem; margin-left:10px; position:relative; z-index:20; padding:5px;"><i class="fas fa-trash"></i></button>`;
    }
    
    const marginStr = isReply ? 'margin-left: 30px; border-left: 2px solid var(--neon-blue);' : '';
    
    return `
        <div class="comment-item" style="margin-bottom:10px; padding:10px; background:rgba(255,255,255,0.02); border-radius:10px; ${marginStr}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <strong style="color:var(--neon-blue); font-size:0.85rem;">${escapeHTML(c.username)} <span style="color:#888; margin-left:5px; font-weight:normal;">${timeAgo(c.created_at)}</span></strong>
                <div style="display:flex; align-items:center;">
                    <button onclick="event.stopPropagation(); window.replyToComment(${postId}, ${isReply ? c.parent_id : c.id}, decodeURIComponent('${safeEncode(c.username)}'))" style="background:none; border:none; color:#888; cursor:pointer; font-size:0.8rem; padding:5px;"><i class="fas fa-reply"></i></button>
                    ${deleteBtn}
                </div>
            </div>
            <p style="font-size:0.95rem; color:#eee; margin: 5px 0 0 0; word-break: break-word;">${escapeHTML(c.content)}</p>
        </div>
    `;
}

window.handleVote = async (id, type) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.customAlert("You must be logged in to vote!", "Notice");
    const voteKey = `voted-${id}-${user.id}`;
    const hasVoted = localStorage.getItem(voteKey);
    const upBtn = document.querySelector(`#tea-${id} .vote-up`);
    const downBtn = document.querySelector(`#tea-${id} .vote-down`);
    const upSpan = document.getElementById(`up-${id}`);
    const downSpan = document.getElementById(`down-${id}`);

    const { data: post } = await supabase.from('Post').select('upvotes, downvotes').eq('id', id).single();
    if (!post) return;
    
    let trueUp = post.upvotes || 0; let trueDown = post.downvotes || 0;
    
    if (hasVoted === type) {
        type === 'up' ? trueUp-- : trueDown--;
        if (trueUp < 0) trueUp = 0; if (trueDown < 0) trueDown = 0;
        await supabase.from('Post').update({ upvotes: trueUp, downvotes: trueDown }).eq('id', id);
        if(upSpan) upSpan.innerText = trueUp; if(downSpan) downSpan.innerText = trueDown;
        localStorage.removeItem(voteKey);
        if(upBtn) { upBtn.style.color = 'white'; upBtn.style.borderColor = 'var(--glass-border)'; }
        if(downBtn) { downBtn.style.color = 'white'; downBtn.style.borderColor = 'var(--glass-border)'; }
        return;
    }

    if (hasVoted && hasVoted !== type) return window.customAlert("Undo your first vote to change sides! ☕", "Notice");

    type === 'up' ? trueUp++ : trueDown++;
    const { error } = await supabase.from('Post').update({ upvotes: trueUp, downvotes: trueDown }).eq('id', id);
    if (!error) { 
        if(upSpan) upSpan.innerText = trueUp; if(downSpan) downSpan.innerText = trueDown; 
        localStorage.setItem(voteKey, type); 
        
        if (type === 'up' && upBtn) { upBtn.style.color = 'var(--neon-pink)'; upBtn.style.borderColor = 'var(--neon-pink)'; }
        if (type === 'down' && downBtn) { downBtn.style.color = 'var(--neon-blue)'; downBtn.style.borderColor = 'var(--neon-blue)'; }

        if (type === 'up') {
            const { data: postData } = await supabase.from('Post').select('user_id').eq('id', id).single();
            if (postData && postData.user_id && postData.user_id !== user.id) {
                await supabase.from('notifications').insert({ recipient_id: postData.user_id, sender_id: user.id, type: 'like', post_id: id });
            }
        }
    }
};

window.shareTea = async (id) => {
    const shareUrl = `${window.location.origin}/tea-view.html?id=${id}`;
    if (navigator.share) await navigator.share({ title: 'Tea House ☕', url: shareUrl });
    else { navigator.clipboard.writeText(shareUrl); window.customAlert("Link copied! 🔗"); }
};

window.openFullTea = (id) => { window.open(`tea-view.html?id=${id}`, '_blank'); };

window.deleteTea = async (id) => {
    window.customConfirm("Are you sure you want to permanently delete this post?", async () => {
        const { data: post } = await supabase.from('Post').select('image_url, username').eq('id', id).maybeSingle();
        if (post && post.image_url) {
            const urls = post.image_url.split(',');
            const fileNames = urls.map(url => decodeURIComponent(url.split('?')[0].split('/').pop())); 
            await supabase.storage.from('tea-attachments').remove(fileNames);
        }
        const { error } = await supabase.from('Post').delete().eq('id', id);
        if (!error) {
            if (IS_ADMIN || IS_FOUNDER) await window.logAdminAction("DELETED POST", `Post ID: ${id} by ${post?.username || 'Unknown'}`);
            const el = document.getElementById(`tea-${id}`);
            if (el) el.remove(); else window.location.href = 'lounge.html'; 
            window.customAlert("Post deleted successfully.", "Deleted");
        }
    }, null, "Delete Post", "Delete", true);
};

/* --- 8. PUBLIC PROFILE VIEWER --- */
async function loadPublicProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');
    if (!profileId) return;

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', profileId).maybeSingle();
    const { data: userPosts } = await supabase.from('Post').select('*').eq('user_id', profileId).order('created_at', { ascending: false });
    const { count: followerCount } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', profileId);
    
    let displayUsername = 'Unknown Spiller';
    if (profile && profile.username) displayUsername = profile.username;
    else if (userPosts && userPosts.length > 0) displayUsername = userPosts[0].username; 
    
    const nameDisplay = document.getElementById('public-name');
    const bioDisplay = document.getElementById('public-bio');
    if(nameDisplay) nameDisplay.innerText = escapeHTML(displayUsername);
    if(bioDisplay) bioDisplay.innerText = profile && profile.bio ? escapeHTML(profile.bio) : 'No bio provided.';
    
    const picDisplay = document.getElementById('public-pic-display');
    if (picDisplay && profile && profile.avatar_url) {
        picDisplay.innerHTML = `<img src="${profile.avatar_url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    }
    
    let socialsHTML = '';
    if (profile) {
        if (profile.insta) socialsHTML += `<a href="https://instagram.com/${escapeHTML(profile.insta).replace('@','')}" class="social-badge" target="_blank"><i class="fab fa-instagram" style="color:#e1306c;"></i> ${escapeHTML(profile.insta)}</a>`;
        if (profile.twitter) socialsHTML += `<a href="https://twitter.com/${escapeHTML(profile.twitter).replace('@','')}" class="social-badge" target="_blank"><i class="fab fa-x-twitter" style="color:#fff;"></i> ${escapeHTML(profile.twitter)}</a>`;
        if (profile.discord) socialsHTML += `<a href="${escapeHTML(profile.discord)}" class="social-badge" target="_blank"><i class="fab fa-discord" style="color:#5865F2;"></i> Discord</a>`;
    }
    const socialsDiv = document.getElementById('public-socials');
    if(socialsDiv) socialsDiv.innerHTML = socialsHTML;

    const followerStat = document.getElementById('stat-followers');
    if(followerStat) followerStat.innerText = followerCount || 0;

    if (userPosts) {
        const teaStat = document.getElementById('stat-teas');
        if(teaStat) teaStat.innerText = userPosts.length;
        let totalLikes = 0; let feedHTML = '';
        userPosts.forEach(post => {
            totalLikes += (post.upvotes || 0);
            feedHTML += `
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 15px; margin-bottom: 15px; cursor: pointer; text-align:left;" onclick="openFullTea(${post.id})">
                    <span style="color: var(--neon-blue); font-size: 0.8rem; text-transform: uppercase;">#${escapeHTML(post.category)}</span>
                    <p style="color: #ccc; font-size: 0.95rem; margin: 10px 0;">${escapeHTML(post.content.substring(0, 100))}...</p>
                    <div style="font-size: 0.8rem; color: #888;">☕ ${post.upvotes} Votes &nbsp;&nbsp; ${timeAgo(post.created_at)}</div>
                </div>`;
        });
        const likesStat = document.getElementById('stat-likes');
        if(likesStat) likesStat.innerText = totalLikes;
        const feedDiv = document.getElementById('public-tea-feed');
        if(feedDiv) feedDiv.innerHTML = feedHTML || '<p style="color:#888; text-align:center;">No tea spilled yet.</p>';
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const followBtn = document.getElementById('follow-btn');
    
    if (followBtn && currentUser && currentUser.id !== profileId) {
        followBtn.style.display = 'inline-block';
        const { data: isFollowing } = await supabase.from('followers').select('*').eq('follower_id', currentUser.id).eq('following_id', profileId).maybeSingle();
        
        if (isFollowing) { followBtn.innerText = "UNFOLLOW"; followBtn.classList.add('following'); }

        followBtn.onclick = async () => {
            if (followBtn.innerText === "FOLLOW") {
                await supabase.from('followers').insert([{ follower_id: currentUser.id, following_id: profileId }]);
                await supabase.from('notifications').insert({ recipient_id: profileId, sender_id: currentUser.id, type: 'follow' });
                followBtn.innerText = "UNFOLLOW"; followBtn.classList.add('following');
                const statFollowers = document.getElementById('stat-followers');
                if(statFollowers) statFollowers.innerText = parseInt(statFollowers.innerText) + 1;
            } else {
                await supabase.from('followers').delete().match({ follower_id: currentUser.id, following_id: profileId });
                followBtn.innerText = "FOLLOW"; followBtn.classList.remove('following');
                const statFollowers = document.getElementById('stat-followers');
                if(statFollowers) statFollowers.innerText = parseInt(statFollowers.innerText) - 1;
            }
        };
    }
}

/* --- 9. PRIVATE PROFILE LOGIC --- */
async function setupProfile() {
    const profileName = document.querySelector('.profile-name');
    if (!profileName) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = 'auth.html'; return; }

    profileName.innerText = user.user_metadata.full_name || user.email.split('@')[0];

    const bioText = document.getElementById('profile-bio-text');
    const instaLink = document.getElementById('profile-insta-link');
    const instaText = document.getElementById('profile-insta-text');
    const twitterLink = document.getElementById('profile-twitter-link');
    const twitterText = document.getElementById('profile-twitter-text');
    const discordLink = document.getElementById('profile-discord-link');

    if (user.user_metadata.bio && bioText) { 
        bioText.innerText = escapeHTML(user.user_metadata.bio); 
        checkBioLength(user.user_metadata.bio); 
    }
    
    if (user.user_metadata.insta && instaLink) {
        const cleanInsta = escapeHTML(user.user_metadata.insta).replace('@', '');
        instaLink.href = `https://instagram.com/${cleanInsta}`;
        instaText.innerText = cleanInsta;
        instaLink.style.display = 'inline-flex';
    }

    if (user.user_metadata.twitter && twitterLink) {
        const cleanTwitter = escapeHTML(user.user_metadata.twitter).replace('@', '');
        twitterLink.href = `https://twitter.com/${cleanTwitter}`;
        twitterText.innerText = cleanTwitter;
        twitterLink.style.display = 'inline-flex';
    }

    if (user.user_metadata.discord && discordLink) {
        discordLink.href = escapeHTML(user.user_metadata.discord); 
        discordLink.style.display = 'inline-flex';
    }

    // Reveal the Command Center in the 3-dot menu if they are an admin
    if (IS_ADMIN || IS_FOUNDER) {
        const adminDropdownItem = document.getElementById('dropdown-admin-btn');
        if (adminDropdownItem) adminDropdownItem.style.display = 'flex';
    }

    const picDisplay = document.getElementById('profile-pic-display');
    const localAvatar = localStorage.getItem(`avatar_${user.id}`); 
    const savedAvatar = localAvatar || user.user_metadata.custom_avatar || user.user_metadata.avatar_url; 
    if (savedAvatar && picDisplay) { picDisplay.innerHTML = `<img src="${savedAvatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`; }

    const { count: followerCount } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', user.id);
    const { count: followingCount } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', user.id);
    
    if (document.getElementById('stat-followers')) document.getElementById('stat-followers').innerText = followerCount || 0;
    if (document.getElementById('stat-following')) document.getElementById('stat-following').innerText = followingCount || 0;

    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            picDisplay.innerHTML = `<p style="font-size:0.6rem;">Uploading...</p>`;
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
            if (uploadError) return window.customAlert("Avatar upload failed: " + uploadError.message, "Error", true);

            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
            localStorage.setItem(`avatar_${user.id}`, data.publicUrl);
            await supabase.auth.updateUser({ data: { custom_avatar: data.publicUrl } });
            await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
            picDisplay.innerHTML = `<img src="${data.publicUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        });
    }

    const { data: userPosts } = await supabase.from('Post').select('id, upvotes').eq('user_id', user.id);
    if (userPosts) {
        const teasSpan = document.getElementById('stat-teas');
        if (teasSpan) teasSpan.innerText = userPosts.length;
        let totalLikes = 0;
        userPosts.forEach(post => { totalLikes += (post.upvotes || 0); });
        const likesSpan = document.getElementById('stat-likes');
        if (likesSpan) likesSpan.innerText = totalLikes;
    }
    window.switchTab('mine');
}

/* --- ⚙️ PROFILE MENU LOGIC --- */
window.toggleProfileMenu = (event) => {
    event.stopPropagation();
    const dropdown = document.getElementById('profileDropdown');
    if(dropdown) dropdown.classList.toggle('show');
};

window.addEventListener('click', (event) => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && dropdown.classList.contains('show') && !event.target.matches('.three-dot-btn, .three-dot-btn *')) {
        dropdown.classList.remove('show');
    }
});

/* --- 🗑️ DELETE ACCOUNT LOGIC --- */
window.deleteMyAccount = async () => {
    window.customConfirm(
        "WARNING: This action is permanent! It will wipe your profile, all your spilled tea, your followers, and your comments. Are you absolutely sure?", 
        async () => {
            document.getElementById('profileDropdown').classList.remove('show');
            const { error } = await supabase.rpc('delete_user_account');
            
            if (error) { window.customAlert("Failed to delete account: " + error.message, "Error", true); } 
            else {
                await supabase.auth.signOut();
                window.customAlert("Your account has been permanently deleted.", "Account Deleted");
                setTimeout(() => { window.location.href = 'index.html'; }, 2500);
            }
        }, null, "Nuclear Option", "Wipe My Data", true 
    );
};

window.toggleBio = () => {
    const bioText = document.getElementById('profile-bio-text');
    const btn = document.getElementById('read-more-bio');
    if (bioText.classList.contains('expanded')) { bioText.classList.remove('expanded'); btn.innerText = "more"; } 
    else { bioText.classList.add('expanded'); btn.innerText = "less"; }
};

function checkBioLength(bioString) {
    const btn = document.getElementById('read-more-bio');
    if (bioString && (bioString.length > 110 || (bioString.match(/\n/g) || []).length > 2)) btn.style.display = 'inline-block';
    else btn.style.display = 'none';
}

window.openEditModal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    document.getElementById('edit-name-input').value = user.user_metadata.full_name || user.email.split('@')[0];
    document.getElementById('edit-bio-input').value = user.user_metadata.bio || '';
    document.getElementById('edit-insta-input').value = (user.user_metadata.insta || '').replace('@', '');
    document.getElementById('edit-twitter-input').value = (user.user_metadata.twitter || '').replace('@', '');
    document.getElementById('edit-discord-input').value = user.user_metadata.discord || '';
    document.getElementById('edit-profile-modal').style.display = 'flex';
};

window.closeEditModal = () => { document.getElementById('edit-profile-modal').style.display = 'none'; };

window.saveProfileData = async () => {
    const btn = document.getElementById('save-profile-btn');
    btn.innerText = "SAVING...";
    
    const newName = document.getElementById('edit-name-input').value.trim();
    const newBio = document.getElementById('edit-bio-input').value.trim();
    const newInsta = document.getElementById('edit-insta-input').value.trim();
    const newTwitter = document.getElementById('edit-twitter-input').value.trim();
    const newDiscord = document.getElementById('edit-discord-input').value.trim();

    const { data: { user }, error } = await supabase.auth.updateUser({ 
        data: { full_name: newName, bio: newBio, insta: newInsta, twitter: newTwitter, discord: newDiscord } 
    });

    if (!error) {
        await supabase.from('profiles').update({
            username: newName, bio: newBio, insta: newInsta, twitter: newTwitter, discord: newDiscord
        }).eq('id', user.id);

        const nameDisplay = document.querySelector('.profile-name');
        const bioText = document.getElementById('profile-bio-text');
        
        if (nameDisplay) nameDisplay.innerText = escapeHTML(newName) || "Anonymous";
        if (bioText) { bioText.innerText = escapeHTML(newBio) || "No bio set yet."; checkBioLength(newBio); }
        
        const instaLink = document.getElementById('profile-insta-link');
        if (newInsta !== "") { const cleanInsta = escapeHTML(newInsta).replace('@', ''); if (instaLink) { instaLink.href = `https://instagram.com/${cleanInsta}`; instaLink.style.display = 'inline-flex'; } document.getElementById('profile-insta-text').innerText = cleanInsta; } 
        else if (instaLink) { instaLink.style.display = 'none'; }

        const twitterLink = document.getElementById('profile-twitter-link');
        if (newTwitter !== "") { const cleanTwitter = escapeHTML(newTwitter).replace('@', ''); if (twitterLink) { twitterLink.href = `https://twitter.com/${cleanTwitter}`; twitterLink.style.display = 'inline-flex'; } document.getElementById('profile-twitter-text').innerText = cleanTwitter; } 
        else if (twitterLink) { twitterLink.style.display = 'none'; }

        const discordLink = document.getElementById('profile-discord-link');
        if (newDiscord !== "") { if (discordLink) { discordLink.href = escapeHTML(newDiscord); discordLink.style.display = 'inline-flex'; } } 
        else if (discordLink) { discordLink.style.display = 'none'; }
        
        window.closeEditModal();
    } else { window.customAlert("Failed to save profile: " + error.message, "Error", true); }
    btn.innerText = "SAVE CHANGES";
};

window.openFollowList = async (type) => {
    const modal = document.getElementById('follow-list-modal');
    const title = document.getElementById('follow-modal-title');
    const content = document.getElementById('follow-list-content');
    
    if (!modal || !content) return;
    
    modal.style.display = 'flex';
    title.innerText = type === 'followers' ? 'Your Followers' : 'Following';
    content.innerHTML = `<p style="text-align:center; color:var(--neon-blue); font-family:'Oswald';">Tracking them down... ⏳</p>`;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
        let userList = [];
        if (type === 'followers') {
            const { data } = await supabase.from('followers').select('follower_id').eq('following_id', user.id);
            if (data && data.length > 0) {
                const ids = data.map(d => d.follower_id);
                const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids);
                userList = ids.map(id => { const prof = profiles?.find(p => p.id === id); return prof || { id: id, username: "Ghost Spiller 👻" }; });
            }
        } else {
            const { data } = await supabase.from('followers').select('following_id').eq('follower_id', user.id);
            if (data && data.length > 0) {
                const ids = data.map(d => d.following_id);
                const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids);
                userList = ids.map(id => { const prof = profiles?.find(p => p.id === id); return prof || { id: id, username: "Ghost Spiller 👻" }; });
            }
        }

        if (userList.length > 0) {
            content.innerHTML = userList.map(u => `
                <div style="display:flex; align-items:center; justify-content:space-between; background: rgba(255,255,255,0.03); padding: 12px 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px;">
                    <span style="font-weight:600; color:var(--gold); font-size:1.1rem;">${escapeHTML(u.username)}</span>
                    <button onclick="window.location.href='user.html?id=${u.id}'" style="background:rgba(255,255,255,0.1); border:none; color:white; padding:6px 15px; border-radius:8px; cursor:pointer; font-weight:bold; transition: 0.2s;" onmouseover="this.style.background='var(--neon-blue)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">VIEW</button>
                </div>
            `).join('');
        } else { content.innerHTML = `<p style="text-align:center; color:#666;">No ${type} found yet.</p>`; }
    } catch (err) { content.innerHTML = `<p style="text-align:center; color:red;">Failed to load list.</p>`; }
};

window.closeFollowList = () => { const modal = document.getElementById('follow-list-modal'); if (modal) modal.style.display = 'none'; };

window.switchTab = async (tabType) => {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    const clickedBtn = Array.from(tabs).find(t => t.getAttribute('onclick').includes(tabType));
    if (clickedBtn) clickedBtn.classList.add('active');

    const feedContainer = document.getElementById('my-tea-feed');
    if (!feedContainer) return;

    feedContainer.innerHTML = `<p style="text-align: center; color: var(--neon-blue); margin-top: 50px;">Fetching your records... ☕</p>`;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let postsToRender = [];
    try {
        if (tabType === 'mine') {
            const { data } = await supabase.from('Post').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            postsToRender = data || [];
        } else if (tabType === 'favs') {
            const { data } = await supabase.from('favourite_teas').select('Post(*)').eq('user_id', user.id).order('created_at', { ascending: false });
            postsToRender = data ? data.map(record => record.Post).filter(p => p !== null) : [];
        } else if (tabType === 'saved') {
            const { data } = await supabase.from('saved_teas').select('Post(*)').eq('user_id', user.id).order('created_at', { ascending: false });
            postsToRender = data ? data.map(record => record.Post).filter(p => p !== null) : [];
        }

        if (postsToRender.length > 0) {
            let allCards = "";
            postsToRender.forEach(post => {
                const displayContent = post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content;
                allCards += `
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 15px; margin-bottom: 15px; text-align: left; cursor: pointer; transition: 0.2s;" onclick="openFullTea(${post.id})" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
                        <div style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: var(--neon-blue); font-weight:bold; font-size: 0.8rem; text-transform: uppercase;">#${escapeHTML(post.category)}</span>
                        </div>
                        <p style="color: #ccc; font-size: 0.95rem; margin: 0;">${escapeHTML(displayContent)}</p>
                        <div style="margin-top: 12px; font-size: 0.8rem; color: #888; font-weight: 500;">
                            ☕ ${post.upvotes} Votes &nbsp;&nbsp; 📸 ${post.image_url ? post.image_url.split(',').length : 0} Proofs &nbsp;&nbsp; ${timeAgo(post.created_at)}
                        </div>
                    </div>`;
            });
            feedContainer.innerHTML = allCards;
        } else {
            let emptyMsg = tabType === 'mine' ? "You haven't spilled any tea yet! ☕" : tabType === 'favs' ? "You haven't liked any tea yet! ❤️" : "Your stash is empty! 🔖";
            feedContainer.innerHTML = `<p style="text-align: center; color: #666; margin-top: 50px; font-weight: 500;">${emptyMsg}</p>`;
        }
    } catch (err) { feedContainer.innerHTML = `<p style="text-align: center; color: red;">Database connection error.</p>`; }
};

/* --- 10. LEADERBOARD LOGIC --- */
async function initLeaderboard() {
    const boardContainer = document.getElementById('leaderboard-feed');
    if (!boardContainer) return; 

    try {
        const { data: posts, error } = await supabase.from('Post').select('*');
        if (error) throw error;

        if (!posts || posts.length === 0) {
            boardContainer.innerHTML = `<p style="text-align: center; color: #888; margin-top: 50px;">No tea spilled yet. The board is empty!</p>`;
            return;
        }

        const userStats = {};
        posts.forEach(post => {
            const identifier = post.username || "Anonymous Spiller";
            if (!userStats[identifier]) {
                userStats[identifier] = { name: identifier, totalVotes: 0, totalPosts: 0, uid: post.user_id };
            }
            userStats[identifier].totalVotes += (post.upvotes || 0);
            userStats[identifier].totalPosts += 1;
        });

        const sortedUsers = Object.values(userStats).sort((a, b) => b.totalVotes - a.totalVotes);

        let boardHTML = "";
        sortedUsers.forEach((user, index) => {
            const rank = index + 1;
            let rankClass = "";
            let crown = "";
            
            if (rank === 1) { rankClass = "row-1"; crown = "👑"; }
            else if (rank === 2) { rankClass = "row-2"; }
            else if (rank === 3) { rankClass = "row-3"; }

            const safeName = escapeHTML(user.name);
            const userLink = user.uid ? `<a href="user.html?id=${user.uid}" style="color: inherit; text-decoration: none;">${safeName}</a>` : safeName;

            boardHTML += `
                <div class="rank-row ${rankClass}">
                    <div class="rank-pos">#${rank}</div>
                    <div class="rank-info">
                        <p class="rank-name">${userLink} ${crown}</p>
                        <p class="rank-stats">${user.totalPosts} Teas Spilled</p>
                    </div>
                    <div class="rank-score"><i class="fas fa-mug-hot"></i> ${user.totalVotes}</div>
                </div>
            `;
        });

        boardContainer.innerHTML = boardHTML;

    } catch (err) { boardContainer.innerHTML = `<p style="text-align: center; color: red; margin-top: 50px;">Failed to load leaderboard.</p>`; }
}

/* =========================================
   💡 DYNAMIC HELP DESK & SUGGESTIONS
   ========================================= */

window.toggleFAQ = (element) => { element.classList.toggle('open'); };

async function loadHelpDesk() {
    const faqContainer = document.getElementById('faq-container');
    if (!faqContainer) return;
    const { data: faqs, error } = await supabase.from('faq').select('*').order('created_at', { ascending: true });
    
    if (error || !faqs || faqs.length === 0) {
        faqContainer.innerHTML = '<p style="color: #888; padding: 20px; text-align: center;">No FAQs available right now.</p>'; return;
    }

    let html = '';
    faqs.forEach((faq, index) => {
        const borderStyle = index === faqs.length - 1 ? 'border-bottom: none;' : '';
        html += `
            <div class="faq-accordion" style="${borderStyle}" onclick="window.toggleFAQ(this)">
                <div class="faq-accordion-header"><span>${escapeHTML(faq.question)}</span><i class="fas fa-chevron-down"></i></div>
                <div class="faq-accordion-body">${escapeHTML(faq.answer)}</div>
            </div>`;
    });
    faqContainer.innerHTML = html;
}

window.submitSuggestion = async () => {
    const textInput = document.getElementById('suggestion-text');
    const message = textInput.value.trim();
    if (!message) return window.customAlert("Please type a message first!", "Notice");

    const { data: { user } } = await supabase.auth.getUser();
    const username = user ? (user.user_metadata.full_name || user.email.split('@')[0]) : "Anonymous User";

    const { error } = await supabase.from('suggestions').insert([{ username, message }]);
    if (!error) { window.customAlert("Message sent to management! Thank you. ☕", "Success"); textInput.value = ''; } 
    else { window.customAlert("Failed to send message: " + error.message, "Error", true); }
};

window.clearAllNotifications = async () => {
    window.customConfirm("Are you sure you want to permanently delete all your notifications?", async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const notifList = document.getElementById('notifications-list');
                if (notifList) notifList.innerHTML = `<p style="text-align: center; color: #888;">No new tea alerts. ☕</p>`;
                const { error } = await supabase.from('notifications').delete().eq('recipient_id', user.id);
                if(error) window.customAlert("Failed to clear alerts: " + error.message, "Error", true);
                else window.customAlert("All alerts have been cleared.", "Success");
            }
        }, null, "Clear Alerts", "Delete All", true
    );
};

/* =========================================
   👑 COMMAND CENTER (RBAC & AUDIT SYSTEM)
   ========================================= */

window.logAdminAction = async (action, target) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const safeAdminName = user.user_metadata?.full_name || user.email.split('@')[0];
    await supabase.from('admin_logs').insert([{ admin_email: safeAdminName, action_taken: action, target_info: target }]).then(({error})=>{if(error)console.log("Audit log failed.");});
};

window.switchAdminTab = (tabId, pageTitle) => {
    document.querySelectorAll('.admin-nav-vertical button').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    if (pageTitle) document.getElementById('admin-page-title').innerText = pageTitle;
};

window.initAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.location.href = 'lounge.html';

    IS_FOUNDER = (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

    const { data: admins, error: adminErr } = await supabase.from('site_admins').select('email');
    
    if (adminErr || (!admins && !IS_FOUNDER)) {
        document.body.innerHTML = `<h1 style="color:red; text-align:center; margin-top:20vh;">🚨 ACCESS DENIED: Authorized Personnel Only 🚨</h1>`;
        return setTimeout(() => window.location.href = 'lounge.html', 2000);
    }
    
    if (admins) ADMIN_ROSTER = admins.map(a => a.email.toLowerCase());
    IS_ADMIN = IS_FOUNDER || ADMIN_ROSTER.includes(user.email.toLowerCase());

    if (IS_FOUNDER) {
        document.querySelectorAll('.founder-only').forEach(el => el.style.display = 'block');
        loadAdminRoles();
        loadAuditLogs();
        loadAdminGenresPanel();
    }

    loadAdminTeasAndUsers();
    loadAdminNoticesPanel();
    loadAdminHelpData();
    loadAdminPromosPanel();
};

async function loadAdminTeasAndUsers() {
    const { data: posts } = await supabase.from('Post').select('*').order('created_at', { ascending: false });
    if (posts) {
        document.getElementById('stat-teas').innerText = posts.length; 
        const sortedByVotes = [...posts].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        const top3Ranks = {};
        sortedByVotes.slice(0, 3).forEach((p, index) => { top3Ranks[p.id] = index + 1; });

        document.getElementById('admin-teas-body').innerHTML = posts.map(p => {
            let contentDisplay = p.content ? escapeHTML(p.content) : "📸 Image Only";
            if (p.content && p.content.length > 50) {
                const safeFullTea = safeEncode(p.content).replace(/\n/g, '<br>');
                contentDisplay = `${escapeHTML(p.content.substring(0, 50))}... <a href="#" style="color:var(--neon-blue); font-size:0.8rem; text-decoration:none; margin-left: 5px;" onclick="event.preventDefault(); window.customAlert(decodeURIComponent('${safeFullTea}'), 'Full Tea Post')">Read</a>`;
            }

            let rankBadge = top3Ranks[p.id] ? `<span title="Rank #${top3Ranks[p.id]} on Leaderboard" style="background: rgba(255, 200, 30, 0.15); color:var(--c-yellow); border: 1px solid var(--c-yellow); margin-left:8px; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: bold;">#${top3Ranks[p.id]}</span>` : '';

            return `
            <tr id="admin-tea-${p.id}">
                <td class="td-primary">${escapeHTML(p.username)} ${rankBadge}</td>
                <td>${contentDisplay}</td>
                <td style="display:flex; gap:8px;">
                    <button onclick="window.open('tea-view.html?id=${p.id}', '_blank')" class="admin-btn admin-btn-action">View Full</button>
                    <button onclick="adminDeleteTea(${p.id}, decodeURIComponent('${safeEncode(p.username)}'))" class="admin-btn admin-btn-danger">Delete</button>
                </td>
            </tr>`;
        }).join('') || '<tr><td colspan="3" style="text-align:center; color:#888;">No teas spilled yet.</td></tr>';
    }

    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: banned } = await supabase.from('banned_users').select('*');
    if (profiles) {
        document.getElementById('stat-users').innerText = profiles.length; 
        document.getElementById('admin-users-body').innerHTML = profiles.map(u => {
            let isBanned = banned && banned.find(b => b.user_id === u.id);
            let status = isBanned ? `<span class="admin-badge badge-banned">Banned</span>` : `<span class="admin-badge badge-live">Active</span>`;
            let btn = isBanned 
                ? `<button onclick="adminUnbanUser('${u.id}', decodeURIComponent('${safeEncode(u.username)}'))" class="admin-btn admin-btn-safe">Unban</button>`
                : `<button onclick="adminBanUser('${u.id}', decodeURIComponent('${safeEncode(u.username)}'))" class="admin-btn admin-btn-danger">Ban</button>`;
            
            return `
            <tr class="user-row">
                <td class="td-primary"><a href="user.html?id=${u.id}" target="_blank" style="color:inherit; text-decoration:none;" class="user-search-name">${escapeHTML(u.username)} <i class="fas fa-external-link-alt" style="font-size:0.7rem; color:#666; margin-left:5px;"></i></a></td>
                <td>${status}</td><td>${btn}</td>
            </tr>`;
        }).join('') || '<tr><td colspan="3" style="text-align:center; color:#888;">No users found.</td></tr>';
    }
}

window.adminDeleteTea = async (id, username) => {
    window.customConfirm("Are you sure you want to permanently delete this post?", async () => {
        await supabase.from('Post').delete().eq('id', id);
        await window.logAdminAction("DELETED POST", `Post ID: ${id} by ${username}`);
        const el = document.getElementById(`admin-tea-${id}`); if(el) el.remove();
        window.customAlert("Post deleted successfully.", "Deleted");
    }, null, "Delete Post", "Delete", true);
};

window.adminBanUser = async (userId, username) => {
    window.customConfirm(`Are you sure you want to ban ${username}?`, async () => {
        await supabase.from('banned_users').insert([{ user_id: userId, username: username }]);
        await window.logAdminAction("BANNED USER", `User: ${username}`);
        window.customAlert(`${username} has been banned.`, "User Banned", true);
        loadAdminTeasAndUsers();
    }, null, "Ban User", "Ban", true);
};

window.adminUnbanUser = async (userId, username) => {
    window.customConfirm(`Are you sure you want to restore access to ${username}?`, async () => {
        await supabase.from('banned_users').delete().eq('user_id', userId);
        await window.logAdminAction("UNBANNED USER", `User: ${username}`);
        window.customAlert(`${username} has been restored.`, "User Unbanned");
        loadAdminTeasAndUsers();
    }, null, "Unban User", "Unban");
};

async function loadAdminNoticesPanel() {
    const { data: notices, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (notices) {
        if(document.getElementById('stat-notices')) document.getElementById('stat-notices').innerText = notices.length; 
        if(document.getElementById('admin-notices-body')) {
            document.getElementById('admin-notices-body').innerHTML = notices.map(n => `
                <tr>
                    <td class="td-primary">${escapeHTML(n.message)}</td>
                    <td><span class="admin-badge badge-live">Live</span></td>
                    <td style="display:flex; gap:8px;">
                        <button onclick="adminEditNotice(${n.id}, decodeURIComponent('${safeEncode(n.message)}'))" class="admin-btn admin-btn-action">Edit</button>
                        <button onclick="adminDeleteNotice(${n.id})" class="admin-btn admin-btn-danger">Remove</button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="3" style="text-align:center; color:#888;">No notices active.</td></tr>';
        }
    }
}

window.adminAddNotice = async () => {
    window.customPrompt("Enter the official notice message to broadcast:", "Type your notice here...", async (msg) => {
        const { error } = await supabase.from('notices').insert([{ message: msg }]);
        if (error) { window.customAlert("Failed to post notice.", "Error", true); return; }
        await window.logAdminAction("POSTED NOTICE", `Message: ${msg}`);
        window.customAlert("Notice broadcasted successfully! 📢", "Success");
        loadAdminNoticesPanel();
    }, "Post Global Notice");
};

window.adminEditNotice = async (id, currentMsg) => {
    window.customPrompt("Edit your official notice:", "Type your notice here...", async (newMsg) => {
        const { error } = await supabase.from('notices').update({ message: newMsg }).eq('id', id);
        if (error) { window.customAlert("Failed to update notice.", "Error", true); return; }
        await window.logAdminAction("EDITED NOTICE", `Notice ID: ${id}`);
        window.customAlert("Notice updated successfully! 📢", "Success");
        loadAdminNoticesPanel();
    }, "Edit Global Notice", currentMsg);
};

window.adminDeleteNotice = async (id) => {
    window.customConfirm("Are you sure you want to remove this notice?", async () => {
        await supabase.from('notices').delete().eq('id', id);
        await window.logAdminAction("DELETED NOTICE", `Notice ID: ${id}`);
        window.customAlert("Notice removed.", "Deleted");
        loadAdminNoticesPanel();
    }, null, "Remove Notice", "Remove", true);
};

async function loadAdminRoles() {
    const { data: admins } = await supabase.from('site_admins').select('*');
    if (admins) {
        document.getElementById('admin-roles-body').innerHTML = admins.map(a => `
            <tr>
                <td class="td-primary" style="color:var(--gold) !important;">${escapeHTML(a.email)}</td>
                <td><button onclick="revokeAdmin(${a.id}, '${a.email}')" class="admin-btn admin-btn-danger">Revoke Access</button></td>
            </tr>
        `).join('') || `<tr><td colspan="2" style="text-align:center; color:#888;">No moderators hired yet.</td></tr>`;
    }
}

window.appointAdmin = async () => {
    window.customPrompt("Enter the Google Email of the user to make them an Admin:", "user@gmail.com", async (email) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('site_admins').insert([{ email: email, appointed_by: user.email }]);
        if(error) { window.customAlert("Failed to hire admin. Ensure email is correct.", "Error", true); return; }
        window.customAlert(`${email} is now an Admin! 🚬`, "Success");
        loadAdminRoles();
    }, "Hire Moderator");
};

window.revokeAdmin = async (id, email) => {
    window.customConfirm(`Are you sure you want to fire ${email}?`, async () => {
        await supabase.from('site_admins').delete().eq('id', id);
        window.customAlert(`Admin access revoked for ${email}.`, "Revoked", true);
        loadAdminRoles();
    }, null, "Fire Admin", "Revoke Access", true);
};

async function loadAuditLogs() {
    const { data: logs } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(100);
    if (logs && document.getElementById('admin-logs-body')) {
        document.getElementById('admin-logs-body').innerHTML = logs.map(l => {
            const displayAdmin = l.admin_email.includes('@') ? l.admin_email.split('@')[0] : l.admin_email;
            return `
            <tr class="log-row">
                <td class="td-muted log-time">${new Date(l.created_at).toLocaleString()}</td>
                <td class="td-primary log-admin">${escapeHTML(displayAdmin)}</td>
                <td><span class="admin-badge badge-audit log-action">${escapeHTML(l.action_taken)}</span></td>
                <td class="log-target">${escapeHTML(l.target_info)}</td>
                <td><button onclick="window.adminDeleteLog(${l.id})" class="admin-btn admin-btn-danger"><i class="fas fa-trash"></i></button></td>
            </tr>`;
        }).join('') || `<tr><td colspan="5" style="text-align:center; color:#888;">No actions logged yet.</td></tr>`;
    }
}

window.adminDeleteLog = async (id) => {
    window.customConfirm("Delete this audit log?", async () => {
        await supabase.from('admin_logs').delete().eq('id', id);
        loadAuditLogs();
    }, null, "Delete Log", "Delete", true);
};

window.clearAllLogs = async () => {
    window.customConfirm("Are you sure you want to permanently delete ALL audit logs? This cannot be undone.", async () => {
        await supabase.from('admin_logs').delete().neq('id', 0); 
        window.customAlert("All logs cleared.", "Success");
        loadAuditLogs();
    }, null, "Clear All Logs", "Wipe Logs", true);
};

window.filterAuditLogs = () => {
    const input = document.getElementById('admin-log-search');
    if(!input) return;
    const filter = input.value.toUpperCase();
    const rows = document.querySelectorAll('#admin-logs-body .log-row');
    
    rows.forEach(row => {
        const textContent = row.textContent || row.innerText;
        row.style.display = textContent.toUpperCase().includes(filter) ? "" : "none";
    });
};

async function loadAdminHelpData() {
    const { data: sugs } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false });
    if (sugs) {
        if(document.getElementById('stat-feedback')) document.getElementById('stat-feedback').innerText = sugs.length; 
        document.getElementById('admin-sug-body').innerHTML = sugs.map(s => {
            let msgDisplay = escapeHTML(s.message);
            if (s.message.length > 50) {
                const safeFullMsg = safeEncode(s.message).replace(/\n/g, '<br>');
                msgDisplay = `${escapeHTML(s.message.substring(0, 50))}... <a href="#" style="color:var(--neon-blue); font-size:0.8rem; text-decoration:none; margin-left: 5px;" onclick="event.preventDefault(); window.customAlert(decodeURIComponent('${safeFullMsg}'), 'User Feedback')">Read More</a>`;
            }
            return `<tr><td class="td-primary">${escapeHTML(s.username)}</td><td>${msgDisplay}</td><td class="td-muted">${timeAgo(s.created_at)}</td></tr>`;
        }).join('') || '<tr><td colspan="3" style="text-align:center; color:#888;">No feedback submitted.</td></tr>';
    }
    
    const { data: faqs } = await supabase.from('faq').select('*').order('created_at', { ascending: true });
    if (faqs) {
        document.getElementById('admin-faq-body').innerHTML = faqs.map(f => `
            <tr>
                <td class="td-primary">${escapeHTML(f.question)}</td>
                <td class="td-muted">${escapeHTML(f.answer.substring(0, 30))}...</td>
                <td style="display:flex; gap:8px;">
                    <button onclick="window.adminEditFAQ(${f.id}, decodeURIComponent('${safeEncode(f.question)}'), decodeURIComponent('${safeEncode(f.answer)}'))" class="admin-btn admin-btn-action">Edit</button>
                    <button onclick="window.adminDeleteFAQ(${f.id})" class="admin-btn admin-btn-danger">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="3" style="text-align:center; color:#888;">No FAQs exist.</td></tr>';
    }
}

window.adminAddFAQ = async () => {
    window.customDoublePrompt("Enter the FAQ details below:", "Question...", "Answer...", async (q, a) => {
        await supabase.from('faq').insert([{ question: q, answer: a }]); 
        window.customAlert("FAQ added successfully!", "Success");
        loadAdminHelpData(); 
    }, "Add FAQ");
};

window.adminEditFAQ = async (id, currentQ, currentA) => {
    window.customDoublePrompt("Edit the FAQ details below:", "Question...", "Answer...", async (q, a) => {
        await supabase.from('faq').update({ question: q, answer: a }).eq('id', id); 
        window.customAlert("FAQ updated successfully!", "Success");
        loadAdminHelpData(); 
    }, "Edit FAQ", currentQ, currentA);
};

window.adminDeleteFAQ = async (id) => {
    window.customConfirm("Are you sure you want to delete this FAQ permanently?", async () => {
        await supabase.from('faq').delete().eq('id', id); 
        window.customAlert("FAQ deleted.", "Deleted");
        loadAdminHelpData(); 
    }, null, "Delete FAQ", "Delete", true);
};

/* =========================================
   🚀 NEW: PROMOTIONS & GENRE ADMIN MANAGERS
   ========================================= */

window.insertPromoEmoji = (emoji) => {
    const titleInput = document.getElementById('promo-title');
    const descInput = document.getElementById('promo-desc');
    if (document.activeElement === descInput) {
        descInput.value += emoji;
    } else {
        if(titleInput) titleInput.value += emoji;
    }
};

window.togglePromoBuilder = () => {
    const builder = document.getElementById('promo-builder-container');
    if (builder) {
        if (builder.style.display === 'none') {
            builder.style.display = 'block';
        } else {
            builder.style.display = 'none';
            document.getElementById('promo-form').reset();
            document.getElementById('promo-edit-id').value = '';
            document.getElementById('submit-promo-btn').innerText = "Launch Campaign 🚀";
        }
    }
};

window.adminEditPromo = async (id, title, desc, link) => {
    window.togglePromoBuilder();
    document.getElementById('promo-title').value = title;
    document.getElementById('promo-desc').value = desc !== 'null' ? desc : '';
    document.getElementById('promo-link').value = link !== 'null' ? link : '';
    document.getElementById('promo-edit-id').value = id;
    document.getElementById('submit-promo-btn').innerText = "Update Campaign 🔄";
};

async function loadAdminPromosPanel() {
    const { data: promos } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
    if (promos && document.getElementById('admin-promos-body')) {
        document.getElementById('admin-promos-body').innerHTML = promos.map(p => {
            const mediaCount = p.image_url ? p.image_url.split(',').length : 0;
            const linkBadge = p.link_url ? `<a href="${escapeHTML(p.link_url)}" target="_blank" style="color:var(--c-blue);"><i class="fas fa-link"></i></a>` : '';
            return `
            <tr>
                <td class="td-primary">
                    ${escapeHTML(p.title)}<br>
                    <span style="font-size:0.8rem; color:#888; font-weight:normal;">${escapeHTML((p.description || '').substring(0, 40))}...</span>
                </td>
                <td class="td-muted">${mediaCount} Files attached ${linkBadge}</td>
                <td style="display:flex; gap:8px;">
                    <button onclick="window.adminEditPromo(${p.id}, decodeURIComponent('${safeEncode(p.title)}'), decodeURIComponent('${safeEncode(p.description || '')}'), decodeURIComponent('${safeEncode(p.link_url || '')}'))" class="admin-btn admin-btn-action">Edit</button>
                    <button onclick="window.adminDeletePromo(${p.id})" class="admin-btn admin-btn-danger">Remove</button>
                </td>
            </tr>
            `;
        }).join('') || '<tr><td colspan="3" style="text-align:center; color:#888;">No active campaigns.</td></tr>';
    }
}

window.adminDeletePromo = async (id) => {
    window.customConfirm("Remove this promotion?", async () => {
        await supabase.from('promotions').delete().eq('id', id);
        window.customAlert("Promotion removed.", "Deleted");
        loadAdminPromosPanel();
    }, null, "Remove Promo", "Remove", true);
};

async function loadAdminGenresPanel() {
    const { data: genres } = await supabase.from('categories').select('*').order('id', { ascending: true });
    if (genres && document.getElementById('admin-genres-body')) {
        document.getElementById('admin-genres-body').innerHTML = genres.map(g => `
            <tr>
                <td class="td-primary">${escapeHTML(g.emoji)} ${escapeHTML(g.name)}</td>
                <td class="td-muted">${escapeHTML(g.slug)}</td>
                <td>
                    ${g.slug === 'trending' ? '<span style="color:#888; font-size:0.8rem;">Locked</span>' : `<button onclick="window.adminDeleteGenre(${g.id}, '${g.slug}')" class="admin-btn admin-btn-danger">Delete</button>`}
                </td>
            </tr>
        `).join('');
    }
}

window.adminAddGenre = async () => {
    window.customDoublePrompt("Enter new Genre:", "Emoji + Name (e.g., 💻 Tech)", "Slug (e.g., tech)", async (nameStr, slug) => {
        const emoji = Array.from(nameStr)[0]; 
        const name = nameStr.substring(emoji ? emoji.length : 0).trim();
        const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');

        const { error } = await supabase.from('categories').insert([{ emoji: emoji, name: name, slug: cleanSlug }]);
        if (error) return window.customAlert("Failed to add genre: " + error.message, "Error", true);
        window.customAlert("New Genre added!", "Success");
        loadAdminGenresPanel();
    }, "Add New Genre");
};

window.adminDeleteGenre = async (id, slug) => {
    if (slug === 'trending') return window.customAlert("Cannot delete the trending category.", "Error", true);
    window.customConfirm(`Delete the genre "${slug}"?`, async () => {
        await supabase.from('categories').delete().eq('id', id);
        window.customAlert("Genre removed.", "Deleted");
        loadAdminGenresPanel();
    }, null, "Delete Genre", "Delete", true);
};

window.filterAdminUsers = () => {
    const input = document.getElementById('admin-user-search');
    const filter = input.value.toUpperCase();
    const rows = document.querySelectorAll('#admin-users-body .user-row');
    rows.forEach(row => {
        const nameElement = row.querySelector('.user-search-name');
        if (nameElement) {
            const txtValue = nameElement.textContent || nameElement.innerText;
            row.style.display = txtValue.toUpperCase().includes(filter) ? "" : "none";
        }
    });
};

/* --- 📄 NEW PAGE RENDERERS (Promos & Notices) --- */
async function loadPromosPage() {
    const feed = document.getElementById('promo-page-feed');
    if (!feed) return;
    
    // Clear Red Dot
    localStorage.setItem('lastSeenPromoTime', Date.now());

    const { data: promos } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
    
    if (promos && promos.length > 0) {
        feed.innerHTML = promos.map(p => {
            let mediaHTML = '';
            if (p.image_url) {
                const urls = p.image_url.split(',');
                mediaHTML = `<div class="promo-media-gallery">`;
                urls.forEach(url => {
                    if (url.match(/\.(mp4|webm|ogg)$/i)) mediaHTML += `<div class="promo-media-item"><video controls src="${url}"></video></div>`;
                    else if (url.includes('.pdf')) mediaHTML += `<div class="promo-media-item" style="display:flex; align-items:center; justify-content:center; background:#111;"><a href="${url}" target="_blank" style="color:#ff4d4d; text-decoration:none;"><i class="fas fa-file-pdf" style="font-size:3rem; margin-bottom:10px; display:block;"></i> Open PDF</a></div>`;
                    else mediaHTML += `<div class="promo-media-item"><img src="${url}"></div>`;
                });
                mediaHTML += `</div>`;
            }
            
            const linkBtn = p.link_url ? `<div class="promo-action"><a href="${escapeHTML(p.link_url)}" target="_blank" class="promo-btn">Check it out <i class="fas fa-external-link-alt"></i></a></div>` : '';
            
            return `
            <div class="promo-card">
                <div class="promo-card-header">
                    <h2>${escapeHTML(p.title)}</h2>
                    <p>${escapeHTML(p.description || '')}</p>
                </div>
                ${mediaHTML}
                ${linkBtn}
            </div>`;
        }).join('');
    } else {
        feed.innerHTML = '<p style="text-align: center; color: #888;">No active campaigns right now.</p>';
    }
}

async function loadNoticesPage() {
    const feed = document.getElementById('notice-page-feed');
    if (!feed) return;

    // Clear Red Dot
    localStorage.setItem('lastSeenNoticeTime', Date.now());

    const { data: notices } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    
    if (notices && notices.length > 0) {
        feed.innerHTML = notices.map(n => `
            <div class="notice-card">
                <p>${escapeHTML(n.message)}</p>
                <span class="notice-date">${new Date(n.created_at).toLocaleDateString()}</span>
            </div>
        `).join('');
    } else {
        feed.innerHTML = '<p style="text-align: center; color: #888;">No announcements at this time.</p>';
    }
}

/* --- 🔴 SIDEBAR ALERT CHECKER (Red Dot Logic) --- */
async function checkSidebarAlerts() {
    const hamburger = document.querySelector('.hamburger-btn');
    if (!hamburger) return;

    const { data: latestNotice } = await supabase.from('notices').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle();
    const lastSeenNotice = localStorage.getItem('lastSeenNoticeTime') || 0;
    const hasNewNotice = latestNotice && new Date(latestNotice.created_at).getTime() > lastSeenNotice;

    const { data: latestPromo } = await supabase.from('promotions').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle();
    const lastSeenPromo = localStorage.getItem('lastSeenPromoTime') || 0;
    const hasNewPromo = latestPromo && new Date(latestPromo.created_at).getTime() > lastSeenPromo;

    if (hasNewNotice || hasNewPromo) {
        hamburger.classList.add('has-notif');
        if (hasNewPromo) {
            const promoLink = document.querySelector('a[href="promos.html"] span');
            if (promoLink && !promoLink.innerHTML.includes('●')) promoLink.innerHTML += ' <span style="color:red; font-size: 0.8rem;">●</span>';
        }
        if (hasNewNotice) {
            const noticeLink = document.querySelector('a[href="notices.html"] span');
            if (noticeLink && !noticeLink.innerHTML.includes('●')) noticeLink.innerHTML += ' <span style="color:red; font-size: 0.8rem;">●</span>';
        }
    }
}

/* --- INITIALIZATION ROUTER --- */
document.addEventListener('DOMContentLoaded', async () => {
    
    // Add a hidden input to the Promo Form for editing
    const promoFormEl = document.getElementById('promo-form');
    if (promoFormEl && !document.getElementById('promo-edit-id')) {
        promoFormEl.insertAdjacentHTML('afterbegin', '<input type="hidden" id="promo-edit-id" value="">');
    }

    const mediaInput = document.getElementById('media-upload');
    const uploadLabel = document.getElementById('upload-label');
    const previewContainer = document.getElementById('image-preview-container');
    const previewGrid = document.getElementById('preview-grid');
    const removeImageBtn = document.getElementById('remove-image');

    if (mediaInput && previewContainer) {
        mediaInput.addEventListener('change', function() {
            previewGrid.innerHTML = ''; 
            if (this.files.length > 0) {
                for(let i=0; i < this.files.length; i++) {
                    if (this.files[i].size > 50 * 1024 * 1024) {
                        window.customAlert(`The file "${this.files[i].name}" is too large! Maximum size is 50MB.`, "File Too Large", true);
                        this.value = ""; return;
                    }
                }
                Array.from(this.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (file.type.startsWith('video/')) { previewGrid.innerHTML += `<div style="height:90px; width:90px; border-radius:10px; border:2px solid var(--neon-blue); display:flex; align-items:center; justify-content:center; background:#111; color:white; font-size:10px; flex-shrink: 0;">🎥 VIDEO</div>`; } 
                        else { previewGrid.innerHTML += `<img src="${e.target.result}" style="height: 90px; width: 90px; object-fit: cover; border-radius: 10px; border: 2px solid var(--neon-blue); flex-shrink: 0;">`; }
                    }
                    reader.readAsDataURL(file);
                });
                uploadLabel.style.display = 'none';
                previewContainer.style.display = 'block';
            }
        });
        removeImageBtn.addEventListener('click', function() {
            mediaInput.value = ""; previewGrid.innerHTML = ""; previewContainer.style.display = 'none'; uploadLabel.style.display = 'flex'; 
        });
    }

    const promoInput = document.getElementById('promo-media-upload');
    const promoGrid = document.getElementById('promo-preview-grid');
    if (promoInput && promoGrid) {
        promoInput.addEventListener('change', function() {
            promoGrid.innerHTML = ''; 
            Array.from(this.files).forEach(file => {
                if (file.type.startsWith('video/')) {
                    promoGrid.innerHTML += `<div style="height:60px; width:60px; border-radius:8px; border:1px solid var(--c-blue); display:flex; align-items:center; justify-content:center; background:#111; color:white; font-size:10px;">🎥</div>`;
                } else if (file.type === 'application/pdf') {
                    promoGrid.innerHTML += `<div style="height:60px; width:60px; border-radius:8px; border:1px solid #ff4d4d; display:flex; align-items:center; justify-content:center; background:#111; color:white; font-size:10px;">📄 PDF</div>`;
                } else {
                    const reader = new FileReader();
                    reader.onload = e => promoGrid.innerHTML += `<img src="${e.target.result}" style="height: 60px; width: 60px; object-fit: cover; border-radius: 8px; border: 1px solid var(--c-blue);">`;
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    const promoForm = document.getElementById('promo-form');
    if (promoForm) {
        promoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-promo-btn');
            btn.innerText = "Processing... ⏳";

            const editId = document.getElementById('promo-edit-id').value;
            const title = document.getElementById('promo-title').value.trim();
            const desc = document.getElementById('promo-desc').value.trim();
            const link = document.getElementById('promo-link').value.trim();
            const mediaFiles = document.getElementById('promo-media-upload').files;
            
            let finalMediaUrls = [];

            if (mediaFiles.length > 0) {
                for (let i = 0; i < mediaFiles.length; i++) {
                    const file = mediaFiles[i];
                    if (file.size > 50 * 1024 * 1024) {
                        btn.innerText = "Launch Campaign 🚀";
                        return window.customAlert(`File ${file.name} is too large!`, "Error", true);
                    }
                    const fileName = `promo-${Date.now()}-${i}.${file.name.split('.').pop()}`; 
                    const { error: uploadError } = await supabase.storage.from('tea-attachments').upload(fileName, file);
                    if (!uploadError) finalMediaUrls.push(supabase.storage.from('tea-attachments').getPublicUrl(fileName).data.publicUrl);
                }
            }

            let error;
            if (editId) {
                const updateData = { title: title, description: desc, link_url: link };
                if (finalMediaUrls.length > 0) updateData.image_url = finalMediaUrls.join(',');
                const response = await supabase.from('promotions').update(updateData).eq('id', editId);
                error = response.error;
            } else {
                const response = await supabase.from('promotions').insert([{ 
                    title: title, description: desc, link_url: link, 
                    image_url: finalMediaUrls.length > 0 ? finalMediaUrls.join(',') : null 
                }]);
                error = response.error;
            }

            if (error) { window.customAlert("Failed to process promo: " + error.message, "Error", true); } 
            else {
                await window.logAdminAction(editId ? "EDITED CAMPAIGN" : "LAUNCHED CAMPAIGN", `Title: ${title}`);
                window.customAlert(editId ? "Promotion Updated! 🔄" : "Promotion is now live! 🚀", "Success");
                promoForm.reset();
                document.getElementById('promo-edit-id').value = '';
                document.getElementById('promo-preview-grid').innerHTML = '';
                window.togglePromoBuilder();
                loadAdminPromosPanel();
            }
            btn.innerText = "Launch Campaign 🚀";
        });
    }

    await checkUser();
    await checkSidebarAlerts();
    await initGlobalCategories(); 
    
    if (window.location.pathname.includes('user.html')) { loadPublicProfile(); } 
    else if (window.location.pathname.includes('profile.html')) { setupProfile(); } 
    else if (window.location.pathname.includes('admin.html')) { initAdmin(); } 
    else if (window.location.pathname.includes('leaderboard.html')) { initLeaderboard(); } 
    else if (window.location.search.includes('id=') && window.location.pathname.includes('tea-view.html')) { loadSingleTea(); } 
    else if (window.location.pathname.includes('help.html')) { loadHelpDesk(); } 
    else if (window.location.pathname.includes('promos.html')) { loadPromosPage(); } 
    else if (window.location.pathname.includes('notices.html')) { loadNoticesPage(); } 
    else if (window.location.pathname.includes('lounge.html')) {
        if (window.location.hash) window.history.replaceState(null, null, window.location.pathname);
        loadTeaFeed(); 
    }
});

window.openSidebar = () => { document.getElementById("side-menu").classList.add("open"); };
window.closeSidebar = () => { document.getElementById("side-menu").classList.remove("open"); };

export async function loadNotifications() {
    const notifList = document.getElementById('notifications-list');
    if (!notifList) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { notifList.innerHTML = `<p style="text-align: center; color: #888;">Please log in to see alerts.</p>`; return; }

    const { data: notifications, error } = await supabase.from('notifications').select(`*, sender:sender_id ( username, avatar_url )`).eq('recipient_id', user.id).order('created_at', { ascending: false });

    if (error) { notifList.innerHTML = `<p style="text-align: center; color: red;">Error loading notifications.</p>`; return; }
    if (!notifications || notifications.length === 0) { notifList.innerHTML = `<p style="text-align: center; color: #888;">No new tea alerts. ☕</p>`; return; }

    let html = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);"><h3 style="color: var(--text-main); font-family: 'Oswald'; margin: 0; font-size: 1.2rem;">Your Alerts</h3><button onclick="window.clearAllNotifications()" style="background:rgba(255,77,77,0.1); border:1px solid rgba(255,77,77,0.3); color:#ff4d4d; cursor:pointer; font-weight:bold; padding: 6px 12px; border-radius: 8px; font-family:'Oswald'; transition: 0.3s;">Clear All <i class="fas fa-trash" style="margin-left: 5px;"></i></button></div>`;

    notifications.forEach(n => {
        const senderName = n.sender ? n.sender.username : 'Someone';
        let icon = ''; let text = '';
        if (n.type === 'like') { icon = '<i class="fas fa-heart notif-icon like"></i>'; text = `<strong>${senderName}</strong> liked your tea.`; } 
        else if (n.type === 'comment') { icon = '<i class="fas fa-comment notif-icon comment"></i>'; text = `<strong>${senderName}</strong> commented: "${n.message || ''}"`; } 
        else if (n.type === 'follow') { icon = '<i class="fas fa-user-plus notif-icon follow"></i>'; text = `<strong>${senderName}</strong> started following you!`; }

        html += `<div class="notif-card ${n.is_read ? '' : 'unread'}">${icon}<div><div class="notif-text">${text}</div><div class="notif-time">${timeAgo(n.created_at)}</div></div></div>`;
    });

    notifList.innerHTML = html;
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', user.id).eq('is_read', false);
}

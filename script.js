
        // Sample book data
        const books = [
            {
                id: 1,
                title: "Introdução à Programação",
                author: "Carlos Silva",
                isbn: "978-85-352-1234-5",
                year: 2020,
                description: "Este livro apresenta os fundamentos da programação de computadores, utilizando linguagem de fácil compreensão e exemplos práticos.",
                category: "Tecnologia",
                status: "available",
                dueDate: null
            },
            {
                id: 2,
                title: "UI/UX Design Principles",
                author: "Ana Oliveira",
                isbn: "978-85-352-5678-9",
                year: 2022,
                description: "Guia completo sobre princípios de design de interface e experiência do usuário, com estudos de caso e melhores práticas.",
                category: "Design",
                status: "available",
                dueDate: null
            },
            {
                id: 3,
                title: "Banco de Dados: Teoria e Prática",
                author: "Roberto Mendes",
                isbn: "978-85-352-9012-7",
                year: 2019,
                description: "Abordagem teórica e prática sobre bancos de dados relacionais e não relacionais, com exemplos em SQL.",
                category: "Tecnologia",
                status: "available",
                dueDate: null
            },
            {
                id: 4,
                title: "Redes de Computadores",
                author: "Fernanda Costa",
                isbn: "978-85-352-3456-1",
                year: 2021,
                description: "Compreenda os fundamentos das redes de computadores, protocolos e arquiteturas de redes modernas.",
                category: "Redes",
                status: "borrowed",
                dueDate: "2024-04-20"
            },
            {
                id: 5,
                title: "Inteligência Artificial: Fundamentos",
                author: "Pedro Alves",
                isbn: "978-85-352-7890-3",
                year: 2023,
                description: "Introdução aos conceitos e aplicações de inteligência artificial e machine learning.",
                category: "IA",
                status: "available",
                dueDate: null
            }
        ];

        // DOM Elements
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section');
        const bookDetailModal = document.getElementById('book-detail-modal');
        const extendLoanModal = document.getElementById('extend-loan-modal');
        const payDebitsModal = document.getElementById('pay-debits-modal');
        const modalCloseButtons = document.querySelectorAll('.modal-close');
        const availableBooksList = document.getElementById('available-books-list');
        const borrowedBooksList = document.getElementById('borrowed-books-list');
        const bookDetailContent = document.getElementById('book-detail-content');
        const extendBookDetail = document.getElementById('extend-book-detail');
        const borrowBookBtn = document.getElementById('borrow-book-btn');
        const confirmExtendBtn = document.getElementById('confirm-extend-btn');
        const payDebitsBtn = document.getElementById('pay-debts-btn');
        const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
        const paymentMethodSelect = document.getElementById('debits-payment-method');
        const pixInfo = document.getElementById('pix-info');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');

        // Current selected book
        let currentBook = null;

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            renderAvailableBooks();
            renderBorrowedBooks();
            setupEventListeners();
        });

        // Setup event listeners
        function setupEventListeners() {
            // Navigation
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    navItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    
                    const section = item.getAttribute('data-section');
                    showSection(section);
                });
            });

            // Modal close buttons
            modalCloseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    bookDetailModal.classList.remove('active');
                    extendLoanModal.classList.remove('active');
                    payDebitsModal.classList.remove('active');
                });
            });

            // Pay debits button
            payDebitsBtn.addEventListener('click', () => {
                payDebitsModal.classList.add('active');
            });

            // Borrow book button
            borrowBookBtn.addEventListener('click', () => {
                if (currentBook) {
                    // Update book status
                    const book = books.find(b => b.id === currentBook.id);
                    if (book) {
                        book.status = 'borrowed';
                        book.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        
                        // Close modal and show success message
                        bookDetailModal.classList.remove('active');
                        showToast('Livro alugado com sucesso!');
                        
                        // Update book lists
                        renderAvailableBooks();
                        renderBorrowedBooks();
                    }
                }
            });

            // Confirm extend button
            confirmExtendBtn.addEventListener('click', () => {
                if (currentBook) {
                    // Update book due date
                    const book = books.find(b => b.id === currentBook.id);
                    if (book) {
                        const extendDays = parseInt(document.getElementById('extend-period').value);
                        const dueDate = new Date(book.dueDate);
                        dueDate.setDate(dueDate.getDate() + extendDays);
                        book.dueDate = dueDate.toISOString().split('T')[0];
                        
                        // Close modal and show success message
                        extendLoanModal.classList.remove('active');
                        showToast('Empréstimo estendido com sucesso!');
                        
                        // Update book list
                        renderBorrowedBooks();
                    }
                }
            });

            // Confirm payment button
            confirmPaymentBtn.addEventListener('click', () => {
                payDebitsModal.classList.remove('active');
                showToast('Pagamento realizado com sucesso!');
            });

            // Payment method change
            paymentMethodSelect.addEventListener('change', (e) => {
                pixInfo.style.display = e.target.value === 'pix' ? 'block' : 'none';
            });
        }

        // Show section based on navigation
        function showSection(section) {
            sections.forEach(sec => {
                sec.style.display = 'none';
            });
            
            document.getElementById(`${section}-card`).style.display = 'block';
        }

        // Render available books
        function renderAvailableBooks() {
            availableBooksList.innerHTML = '';
            
            const availableBooks = books.filter(book => book.status === 'available');
            
            if (availableBooks.length === 0) {
                availableBooksList.innerHTML = '<p>Nenhum livro disponível no momento.</p>';
                return;
            }
            
            availableBooks.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.classList.add('list-item');
                bookElement.innerHTML = `
                    <div class="book-cover">${book.title.substring(0, 15)}</div>
                    <div class="book-info">
                        <div class="book-title">${book.title}</div>
                        <div class="book-author">${book.author}</div>
                    </div>
                    <div class="book-status status-available">Disponível</div>
                `;
                
                bookElement.addEventListener('click', () => {
                    currentBook = book;
                    showBookDetail(book);
                });
                
                availableBooksList.appendChild(bookElement);
            });
        }

        // Render borrowed books
        function renderBorrowedBooks() {
            borrowedBooksList.innerHTML = '';
            
            const borrowedBooks = books.filter(book => book.status === 'borrowed');
            
            if (borrowedBooks.length === 0) {
                borrowedBooksList.innerHTML = '<p>Você não possui livros emprestados no momento.</p>';
                return;
            }
            
            borrowedBooks.forEach(book => {
                const dueDate = new Date(book.dueDate);
                const today = new Date();
                const timeDiff = dueDate.getTime() - today.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                const bookElement = document.createElement('div');
                bookElement.classList.add('list-item');
                bookElement.innerHTML = `
                    <div class="book-cover">${book.title.substring(0, 15)}</div>
                    <div class="book-info">
                        <div class="book-title">${book.title}</div>
                        <div class="book-author">${book.author}</div>
                        <div>Devolução: ${formatDate(dueDate)}</div>
                        <div class="${daysDiff < 3 ? 'text-danger' : ''}">${daysDiff} dias restantes</div>
                    </div>
                    <div>
                        <button class="btn btn-outline extend-btn" data-id="${book.id}">Estender</button>
                    </div>
                `;
                
                const extendBtn = bookElement.querySelector('.extend-btn');
                extendBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentBook = book;
                    showExtendLoanModal(book);
                });
                
                borrowedBooksList.appendChild(bookElement);
            });
        }

        // Show book detail modal
        function showBookDetail(book) {
            bookDetailContent.innerHTML = `
                <h2>${book.title}</h2>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>Ano:</strong> ${book.year}</p>
                <p><strong>Categoria:</strong> ${book.category}</p>
                <p>${book.description}</p>
            `;
            bookDetailModal.classList.add('active');
        }

        // Show extend loan modal
        function showExtendLoanModal(book) {
            const dueDate = new Date(book.dueDate);
            
            extendBookDetail.innerHTML = `
                <h2>${book.title}</h2>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Data de Devolução Atual:</strong> ${formatDate(dueDate)}</p>
            `;
            extendLoanModal.classList.add('active');
        }

        // Format date as DD/MM/YYYY
        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // Show toast notification
        function showToast(message) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
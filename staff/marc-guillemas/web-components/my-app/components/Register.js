// function Register(onSubmit,onLogin) {
//     const temp = document.createElement('div')
//     //Html del formulario de registro
//     temp.innerHTML = `<section class="register">
//     <h1>Register</h1>
//     <form>
//     <input type="text" name="name" placeholder="name">
//     <input type="text" name="surname" placeholder="surname">
//     <input type="email" name="email" placeholder="e-mail">
//     <input type="password" name="password" placeholder="password">
//     <button>Submit</button>
//     <button>Login</button>
//     </form>
//     </section>`
    
//     const container = temp.firstChild
//     const form = container.querySelector('form')
//     const login= container.querySelectorAll("button")[1];
//     //Componente con el mensaje de error que recibe el usuario
//     let feedback;
//     //Para registrar al usuario
//     form.addEventListener('submit', function (event) {
//         event.preventDefault()
//         const name = event.target.name.value,
//         surname = event.target.surname.value,
//         email = event.target.email.value,
//         password = event.target.password.value
        
//         try{
//             onSubmit(name, surname, email, password);
//             form.name.value="";
//             form.surname.value="";
//             form.email.value="";
//             form.password.value="";
//         }catch(error){
//             if(!feedback){
//                 feedback= Feedback(error.message,"error");
//                 container.appendChild(feedback);
//             }else{
//                 feedback.innerText=error.message;
//             }
//         }
//     })
//     //Para cambiar a la pestaña login
//     login.addEventListener("click",function(event){
//         event.preventDefault();
//         onLogin();
//         form.name.value="";
//         form.surname.value="";
//         form.email.value="";
//         form.password.value="";
//     })
//     return container
// } 

class Register extends Component {
    constructor(onSubmit, onLogin) {
        super(`<section class="register">
        <h1>Register</h1>
        <form>
        <input type="text" name="name" placeholder="name">
        <input type="text" name="surname" placeholder="surname">
        <input type="email" name="email" placeholder="e-mail">
        <input type="password" name="password" placeholder="password">
        <button>Submit</button>
        <a href="">Login</a>
        </form>
        </section>`)

        const form = this.container.querySelector('form')

        let feedback

        const self = this

        form.addEventListener('submit', function (event) {
            event.preventDefault()

            let {name, surname, email, password} = event.target

            name = name.value
            surname = surname.value
            email = email.value
            password = password.value

            try {
                onSubmit(name, surname, email, password)

                cleanUp()
            } catch (error) {
                if (!feedback) {
                    feedback = new Feedback(error.message, 'error')

                    self.container.append(feedback.container)
                } else feedback.innerText = error.message
            }
            
        })

        function cleanUp() {
            const {name, surname, email, password} = form

            name.value = ''
            surname.value = ''
            email.value = ''
            password.value = ''

            if (feedback) {
                self.container.removeChild(feedback.container)

                feedback = undefined
            }
        }

        const login = this.container.querySelector('a')

        login.addEventListener('click', function (event) {
            event.preventDefault()

            onLogin()

            cleanUp()

        })
    }
}
Vue.component('register', {
    template: document.querySelector('#register'),
    props: ['tacLink'],
    data: function () {
        return {
            credentials: {
                userName: '',
                emails: [
                    {email: ''}
                ],
                password: {
                    password: ''
                }
            },
            passwordRepeat: '',
            tac: false,
            availableUser: false,
            formValid: false,
            passwordMatch: false,
            registerForm: {},
            busy: false
        }
    },
    mounted() {
        if (typeof this.tacLink === 'undefined') {
            this.tac = true;
        }
        this.registerForm = this.$el.querySelector('form');
    },
    watch: {
        tac: function () {
            this.checkFormValid();
        },
        passwordRepeat() {
            if (this.passwordRepeat.length > 7) {
                this.checkPasswordValidity()
            }
        },
        credentials: {
            deep: true,
            handler(credentials) {
                // username ok?
                this.checkUserName();

            }

        }
    },
    methods: {
        checkPasswordValidity: function () {
            this.passwordMatch = this.registerForm['password'].validity.valid
                && (this.credentials.password.password === this.passwordRepeat);
            this.checkFormValid();
        },
        checkFormValid: function () {
            this.formValid = this.passwordMatch && this.availableUser && this.registerForm['email'].validity.valid && this.tac;
        },
        checkUserName: _.debounce(function () {
            if (this.registerForm['userName'].validity.valid) {
                api.get('register?userName=' + this.credentials.userName).then(res => {
                    this.availableUser = res.data.free;
                    this.checkFormValid();
                })
            } else {
                this.availableUser = false;
                this.checkFormValid();
            }

        }, 500),
        register: async function () {
            this.busy = true;
            try {
                let registration = await api.post('register', this.credentials);
                this.busy = false;
                this.toggleModal();
            } catch (err) {
                console.log(err);
                alert('Something went wrong');
            }

        },
        toggleModal: function () {
            this.$root.$emit('toggleModal','confirm-email');
        }
    }
});

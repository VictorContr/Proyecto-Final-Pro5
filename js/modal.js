export class ModalDialog_vc_jc {
    constructor() {
        // Referencias a elementos DOM
        this.modalContainer_vc_jc = document.getElementById('modalContainer');
        this.modalContent_vc_jc = document.getElementById('modalContent');
        this.modalHeader_vc_jc = document.getElementById('modalHeader');
        this.modalIcon_vc_jc = document.getElementById('modalIcon');
        this.modalTitle_vc_jc = document.getElementById('modalTitle');
        this.modalMessage_vc_jc = document.getElementById('modalMessage');
        this.modalClose_vc_jc = document.getElementById('modalClose');
        this.modalAction_vc_jc = document.getElementById('modalAction');
        this.modalCancel_vc_jc = document.getElementById('modalCancel'); 
        // Variables para manejar la promesa
        this.resolvePromise = null;
        this.rejectPromise = null;

        // Configurar eventos
        this.modalClose_vc_jc.addEventListener('click', () => this.cancel_vc_jc());
        this.modalAction_vc_jc.addEventListener('click', () => this.confirm_vc_jc());
        this.modalCancel_vc_jc.addEventListener('click', () => this.cancel_vc_jc());

        // Cerrar al hacer clic fuera del modal
        this.modalContainer_vc_jc.addEventListener('click', (e_vc_jc) => {
            if (e_vc_jc.target === this.modalContainer_vc_jc) {
                this.cancel_vc_jc();
            }
        });
    }

    show_vc_jc(title_vc_jc, message_vc_jc, type_vc_jc, isConfirm = false) {
        // Configurar según el tipo
        switch(type_vc_jc) {
            case 'success':
                this.modalHeader_vc_jc.className = 'modal-header success-bg';
                this.modalIcon_vc_jc.className = 'modal-icon fas fa-check-circle';
                this.modalAction_vc_jc.className = 'px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700';
                break;
            case 'error':
                this.modalHeader_vc_jc.className = 'modal-header error';
                this.modalIcon_vc_jc.className = 'modal-icon fas fa-times-circle';
                this.modalAction_vc_jc.className = 'px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700';
                break;
            case 'warning':
                this.modalHeader_vc_jc.className = 'modal-header warning-bg';
                this.modalIcon_vc_jc.className = 'modal-icon fas fa-exclamation-triangle';
                this.modalAction_vc_jc.className = 'px-4 py-2 rounded-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700';
                break;
        }
        
        // Establecer contenido
        this.modalTitle_vc_jc.textContent = title_vc_jc;
        this.modalMessage_vc_jc.textContent = message_vc_jc;
        this.modalAction_vc_jc.textContent = type_vc_jc === 'error' ? 'Reintentar' : 'Aceptar';
        
        // Mostrar u ocultar botón de cancelar según sea confirmación
        if (isConfirm) {
            this.modalCancel_vc_jc.style.display = 'block';
        } else {
            this.modalCancel_vc_jc.style.display = 'none';
        }
        
        // Mostrar modal
        this.modalContainer_vc_jc.classList.add('active');
        
        // Bloquear scroll de fondo
        document.body.style.overflow = 'hidden';

        // Devolver una promesa
        return new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
    }

    showConfirm_vc_jc(title_vc_jc, message_vc_jc) {
        return this.show_vc_jc(title_vc_jc, message_vc_jc, 'warning', true);
    }
    
    showSuccess_vc_jc(title_vc_jc, message_vc_jc) {
        return this.show_vc_jc(title_vc_jc, message_vc_jc, 'success');
    }
    
    showError_vc_jc(title_vc_jc, message_vc_jc) {
        return this.show_vc_jc(title_vc_jc, message_vc_jc, 'error');
    }
    
    showWarning_vc_jc(title_vc_jc, message_vc_jc) {
        return this.show_vc_jc(title_vc_jc, message_vc_jc, 'warning');
    }

    confirm_vc_jc() {
        this.hide_vc_jc();
        if (this.resolvePromise) {
            this.resolvePromise(true);
        }
    }

    cancel_vc_jc() {
        this.hide_vc_jc();
        if (this.resolvePromise) {
            this.resolvePromise(false);
        }
    }
    
    hide_vc_jc() {
        this.modalContainer_vc_jc.classList.remove('active');
        
        // Restaurar scroll
        document.body.style.overflow = '';
    }
}

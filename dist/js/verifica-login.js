(async function () {
        if(localStorage.getItem('usuario') && localStorage.getItem('email') && localStorage.getItem('tipo')){
            // Para pegar o valor desse item
            usuario = localStorage.getItem('usuario');
            email = localStorage.getItem('email');
            raiz_email = localStorage.getItem('raiz_email');
            tipo = localStorage.getItem('tipo');
            posicao = localStorage.getItem('posicao');
            acessos_segmento = localStorage.getItem('acessos_segmento');

            await $("#usuario").text(usuario.split(' ')[0]+' '+usuario.split(' ')[usuario.split(' ').length-1]);
            await $("#posicao").text(posicao);

            await $("#avatar").css('background-image','url(./static/avatars/'+raiz_email+'.jfif)');

            if(tipo=='Administrador'){
                $("#verifica_analista_usuario").show();
                $("#verifica_analista_usuario_hml").show();
            }

        } else {
                window.location.assign('./verificacao-usuario');
        }
})();


$("#logout").click(function(){
    localStorage.removeItem('usuario');
    localStorage.removeItem('email');
    localStorage.removeItem('raiz_email');
    localStorage.removeItem('tipo');
    localStorage.removeItem('posicao');
    localStorage.removeItem('acessos_segmento');
    window.location.assign('./verificacao-usuario'); 
});
dados = Array(0);

async function verifica_usuario(input_email){
    var url = 'https://prod-11.westus.logic.azure.com:443/workflows/17d85237df584fa7b79044b8660db8f4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=v_MLtOtoYtQGLlPUVOixr98MdrNAwNtV8nUE3dxxEAQ';

    var login_data = {
        solicitacao: "oauth",
        hash: "1348f1ed93616d59",
        email: input_email,
        x_api_key: "1348f1ed93616d59f6d62eb7631ae137cc902fc9cc4bb22428a384c1cec91c20"
    };

    await fetch(url,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login_data)
    })
        .then(response => response.json())
        .then(data => {
            dados = JSON.parse(data.result);
            var check_email=false;
            var usuario='';
            var tipo='';
            var posicao='';
            var acessos_segmento='';
            for(i=0; i<dados.length; i++){
                if(dados[i].email==input_email){
                    check_email=true;
                    usuario=dados[i].usuario;
                    tipo=dados[i].tipo;
                    posicao=dados[i].posicao;
                    acessos_segmento=dados[i].acessos_segmento;
                }
            }
            if(check_email){
                localStorage.setItem('usuario', usuario);
                localStorage.setItem('email', input_email);
                localStorage.setItem('tipo', tipo);
                localStorage.setItem('posicao', posicao);
                localStorage.setItem('acessos_segmento', acessos_segmento);
                window.location.assign('./index');
            } else {
                console.log('o usuário não existe ou não tem permissão para acessar');
            }
        })
        .catch(error => {
            console.log('problema na conexão com a api');
        })
}

function redireciona_usuario(){
    
}

$("#logout").click(function(){
    localStorage.removeItem('token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('dt_reg');
    localStorage.removeItem('ip_usuario');
    localStorage.removeItem('nome');
    localStorage.removeItem('titulo_nivel');
    localStorage.removeItem('valor_pg');
    window.location.assign('./forgot-password'); 
});

$("#verifica_usuario").click(function(){
    verifica_usuario($("#input_email").val());
});
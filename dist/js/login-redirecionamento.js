dados = Array(0);
hash_gerada_randomicamente = '';

function generateRandomHash(length) {
    const array = new Uint8Array(length / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

hash_gerada_randomicamente = generateRandomHash(32); // Gera uma hash de 32 caracteres
check_email=false;
email='';
usuario='';
tipo='';
posicao='';
acessos_segmento='';

async function verifica_usuario(input_email){
    var url = 'https://prod-11.westus.logic.azure.com:443/workflows/17d85237df584fa7b79044b8660db8f4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=v_MLtOtoYtQGLlPUVOixr98MdrNAwNtV8nUE3dxxEAQ';

    var login_data = {
        solicitacao: "oauth",
        hash: hash_gerada_randomicamente,
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
            for(i=0; i<dados.length; i++){
                if(dados[i].email==input_email){
                    check_email=true;
                    email=input_email;
                    usuario=dados[i].usuario;
                    tipo=dados[i].tipo;
                    posicao=dados[i].posicao;
                    acessos_segmento=dados[i].acessos_segmento;
                }
            }
            if(check_email){
                $("#exibe_input_email").hide();
                $("#exibe_codigo_verificacao").show();
                $("#verifica_usuario").hide();
                $("#verifica_hash").show();
                console.log('o usuário existe proxima etapa de verificacao');
            } else {
                console.log('o usuário não existe ou não tem permissão para acessar');
            }
        })
        .catch(error => {
            console.log('problema na conexão com a api');
        })
}

function verifica_hash(input_hash){
    if(input_hash==hash_gerada_randomicamente){
        localStorage.setItem('usuario', usuario);
        localStorage.setItem('email', email);
        localStorage.setItem('tipo', tipo);
        localStorage.setItem('posicao', posicao);
        localStorage.setItem('acessos_segmento', acessos_segmento);
        window.location.assign('./index');
    } else {
        $("#exibe_input_email").show();
        $("#exibe_codigo_verificacao").hide();
        $("#verifica_usuario").show();
        $("#verifica_hash").hide();
        console.log('o usuário não tem permissão para acessar');
    }
}

$("#verifica_usuario").click(function(){
    verifica_usuario($("#input_email").val());
});

$("#verifica_hash").click(function(){
    verifica_hash($("#input_hash_email").val());
});

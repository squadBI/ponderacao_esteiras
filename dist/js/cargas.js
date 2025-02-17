(async function () {
    dados = Array(0);

    // Para pegar o valor desse item
    usuario = localStorage.getItem('usuario');
    email = localStorage.getItem('email');
    tipo = localStorage.getItem('tipo');
    posicao = localStorage.getItem('posicao');
    acessos_segmento = localStorage.getItem('acessos_segmento');

    await $("#usuario").text(usuario.split(' ')[0]+' '+usuario.split(' ')[usuario.split(' ').length-1]);
    await $("#posicao").text(posicao);

    await carrega_cargas(email);

})();

async function carrega_cargas(input_email){
    var url = 'https://prod-115.westus.logic.azure.com:443/workflows/4ff98d91bce14c8c99312c952c25ea44/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kEVbGgYZ5djj0cWz9uEzP00ZgcnNqZgAvq-SiQFEkAQ';

    var login_data = {
        solicitacao: "listar_tabela",
        tabela: "ponderacao_cargas",
        hash: "1348f1ed93616d59f6d6",
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
            var num_tabelas=dados.length;
            var num_consultas=0;
            var num_tabelas_s3=0;
            var icone_carga = '';
            for(i=0; i<dados.length; i++){
                if(dados[i].tipo_fonte=='SQL'){
                    num_consultas++;
                    icone_carga = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-sql"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M18 15v6h2" /><path d="M13 15a2 2 0 0 1 2 2v2a2 2 0 1 1 -4 0v-2a2 2 0 0 1 2 -2z" /><path d="M14 20l1.5 1.5" /></svg>';
                }
                if(dados[i].tipo_fonte=='S3'){
                    num_tabelas_s3++;
                    icone_carga = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-xls"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M4 15l4 6" /><path d="M4 21l4 -6" /><path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" /><path d="M11 15v6h3" /></svg>';
                }

                var active = '';
                if(i==0){
                    active = 'active';
                    var id_linha_calculo=dados[i].id;
                }

                $("#dados_cargas").append('<div onclick="carrega_info_cargas('+dados[i].id+')" class="list-group list-group-flush cursor-seleciona-carga">'+
                                            '<div id="info_carga_active'+dados[i].id+'" class="list-group-item '+active+'">'+
                                                '<div class="row align-items-center">'+
                                                  '<div class="col-auto"><input type="checkbox" class="form-check-input"></div>'+
                                                  '<div class="col-auto">'+
                                                    '<a href="#">'+
                                                      '<span class="avatar">'+
                                                      icone_carga+
                                                      '</span>'+
                                                    '</a>'+
                                                  '</div>'+
                                                  '<div class="col text-truncate">'+
                                                    '<a href="#" class="text-reset d-block">'+dados[i].nome_tabela+'</a>'+
                                                    '<div class="d-block text-muted text-truncate mt-n1">'+dados[i].bucket_banco+'</div>'+
                                                  '</div>'+
                                                '</div>'+
                                              '</div>'+
                                            '</div>');

            }
            $("#num_tabelas").text(num_tabelas);
            $("#num_consultas").text(num_consultas);
            $("#num_tabelas_s3").text(num_tabelas_s3);
            carrega_info_cargas(id_linha_calculo);

        })
        .catch(error => {
            console.log('problema na conexão com a api');
        })
}


async function carrega_info_cargas(id_linha){

    await $( ".list-group-item" ).removeClass( "active" );
    await $( "#info_carga_active"+ id_linha ).addClass( "active" );

    for(i=0; i<dados.length; i++){
        if(dados[i].id==id_linha){
            var calculo = dados[i].consulta_url;
            $("#info_cargas").html('');
            $("#info_cargas").append('<div class="datagrid mb-3">'+
                  '<div class="datagrid-item">'+
                    '<div class="datagrid-title">Qtd. linhas</div>'+
                    '<div class="datagrid-content">'+dados[i].num_linhas+'</div>'+
                  '</div>'+
                  '<div class="datagrid-item">'+
                    '<div class="datagrid-title">Qtd. Colunas</div>'+
                    '<div class="datagrid-content">'+dados[i].num_colunas+'</div>'+
                  '</div>'+
                  '<div class="datagrid-item">'+
                    '<div class="datagrid-title">Data Criação</div>'+
                    '<div class="datagrid-content">'+dados[i].data_registro+'</div>'+
                  '</div>'+
                  '<div class="datagrid-item">'+
                    '<div class="datagrid-title">Data Execução</div>'+
                    '<div class="datagrid-content">'+dados[i].data_execucao+'</div>'+
                  '</div>'+
                  '<div class="datagrid-item">'+
                    '<div class="datagrid-title">Usuário</div>'+
                    '<div class="datagrid-content">'+
                      '<div class="d-flex align-items-center">'+
                        dados[i].usuario+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="datagrid-item">'+
                    '<div class="datagrid-title">Descrição</div>'+
                    '<div class="datagrid-content">'+
                      dados[i].descricao_negocio+
                    '</div>'+
                  '</div>'+
                '</div>');
        }
    }

    await $("#editor").html('');
          const editor = CodeMirror(document.getElementById("editor"), {
      mode: "sql",
      theme: "dracula",
      lineNumbers: false,
      value: calculo
    });

}


async function seleciona_tipo_conexao(tipo_conexao){
    if(tipo_conexao=='SQL'){
        $("#exibe_url_s3").hide();
        $("#exibe_campo_consulta").show();
        $("#exibe_conexao_banco").show();
    } else {
        $("#exibe_url_s3").show();
        $("#exibe_campo_consulta").hide();
        $("#exibe_conexao_banco").hide();
    }
}

$("#salvar_informações").click(async function(){

    var url = 'https://prod-80.westus.logic.azure.com:443/workflows/50c9684c2d87410ba22caf36056f0a7b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WkxtGTa_SPCdDiMKgFAfgzrVU389frbpbTbEtQEwECw';

    var verifica_consulta_s3='';
    var verifica_banco_s3='';
    var id_linha_criado=0;

    if($("#report-type").val()=='SQL'){
        verifica_consulta_s3=$("#consulta_sql").val();
        verifica_banco_s3=$("#conexao_banco").val();
    } else {
        verifica_consulta_s3=$("#url_s3").val();
        verifica_banco_s3='algar-data-science-team-dev';
    }

    for(i=0 ; i<dados.length; i++){
        id_linha_criado=i+1;
    }

    id_linha_criado++;

    var insert_data = {
        solicitacao: "insercao_linha_tabela",
        tabela: "ponderacao_cargas",
        id_linha: ""+id_linha_criado+"",
        nome_tabela : $("#nome_tabela").val(),
        consulta_url : verifica_consulta_s3,
        tipo_fonte : $("#report-type").val(),
        bucket_banco : verifica_banco_s3,
        descricao_negocio : $("#descricao_info").val(),
        status : "1",
        usuario : email,
        x_api_key: "1348f1ed93616d59f6d62eb7631ae137cc902fc9cc4bb22428a384c1cec91c20"
    };

    await fetch(url,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(insert_data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('cadastro realizado com sucesso');
        })
        .catch(error => {
            console.log('problema na conexão com a api');
        })

    await $("#dados_cargas").html('');
    await carrega_cargas(email);

});

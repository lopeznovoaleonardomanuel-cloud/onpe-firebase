import { OnpeController} from "./firebase.js"

export const verParticipacion = async (id, ambito) => {
    let querySnapCrudo = []
    let querySnap = null
    let accion = ""
    let tituloColumna = ''
    let html = ''
    let datahtml = ''
    let contenidoInterno = document.getElementById('page-wrap2')
    let contenidoAmbito = document.getElementById('ambito')

    if(ambito == "todos"){
        querySnapCrudo = await OnpeController("participacion", id)
        let _ = querySnapCrudo[1].docs[0].data()
        tituloColumna = _.ID == 'Nacional' ? 'Departamento' : 'Continente'
        contenidoAmbito.innerHTML = `Ambito: ${_.ID}`
    }
    else if(ambito == "departamento"){
        querySnapCrudo = await OnpeController("provincia", id)
        let _ = querySnapCrudo[1].docs[0].data()
        tituloColumna = _.ID == 'Nacional' ? 'Provincia' : 'Pais'
        let tAmbito = tituloColumna == 'Provincia' ? 'Departamento' : 'Continente'
        contenidoAmbito.innerHTML = `Ambito: ${_.ID}<br>${tAmbito}: ${_.Departamento}`
    }
    else if(ambito == "provincia"){
        querySnapCrudo = await OnpeController("distrito", id)
        let _ = querySnapCrudo[1].docs[0].data()
        tituloColumna = _.ID == 'Nacional' ? 'Distrito' : 'Ciudad'
        let tAmbito = tituloColumna == 'Distrito' ? 'Departamento' : 'Continente'
        let tAmbito2 = tAmbito == 'Departamento' ? 'Provincia' : 'Pais'
        contenidoAmbito.innerHTML = `Ambito: ${_.ID}<br>${tAmbito}: ${_.Departamento}<br>${tAmbito2}: ${_.Provincia}`
    }
    else if(ambito == "distrito"){
        querySnapCrudo = await OnpeController("post-distrito", id)
        let _ = querySnapCrudo[1].docs[0].data()
        tituloColumna = _.ID == 'Nacional' ? 'Distrito' : 'Ciudad'
        let tAmbito = tituloColumna == 'Distrito' ? 'Departamento' : 'Continente'
        let tAmbito2 = tAmbito == 'Departamento' ? 'Provincia' : 'Pais'
        contenidoAmbito.innerHTML = `Ambito: ${_.ID}<br>${tAmbito}: ${_.Departamento}<br>${tAmbito2}: ${_.Provincia}<br>${tituloColumna}: ${_.DPD}`
    }

    querySnap = querySnapCrudo[1]
    accion = querySnapCrudo[0]
    
    
    if(querySnap && ambito != 'distrito'){
        querySnap.forEach(doc =>{
            let ambito = doc.data()
            datahtml += `
                <tr onclick="location.href='./participacion_total.html?id=${ambito.DPD}&&ambito=${accion}'" onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
                    <td>${ambito.DPD}</td>
                    <td>${ambito.TV}</td>
                    <td>${ambito.PTV}</td>
                    <td>${ambito.TA}</td>
                    <td>${ambito.PTA}</td>
                    <td>${ambito.EH}</td>
                </tr>
            `
        })
        
        html += `
            <p class="subtitle">Consulta de participación DETALLADO </p>
            <div id="page-wrap">
                <table class="table21">
                    <tbody id="resultados">
                        <tr class="titulo_tabla">
                            <td>${tituloColumna}</td>
                            <td>TOTAL ASISTENTES</td>
                            <td>% TOTAL ASISTENTES</td>
                            <td>TOTAL AUSENTES</td>
                            <td>% TOTAL AUSENTES</td>
                            <td>ELECTORES HÁBILES</td>
                        </tr>
                        ${datahtml}
                        <tr>
                            <td>TOTALES</td>
                            <td>17,953,367</td>
                            <td>81.543%</td>
                            <td>4,063,663</td>
                            <td>18.457%</td>
                            <td>22,017,030</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `
    } else {
        contenidoInterno.innerHTML = html
        return
    }
    
    contenidoInterno.innerHTML = html
}

// Funcion para las actas
export const verActas = async (q) => {
    let cdgoAmbito = ''
    let cdgoDep = ''
    let cdgoProv = ''
    let cdgoDist = ''
    let cdgoLocal = ''
    let grupoV = ''
    let nroBuscar = ''
    let html = document.getElementById('divDetalle1')
    let actaHtml = document.getElementById('divDetalle')
    if(q == 'ubigeo'){
        cdgoAmbito = document.getElementById('cdgoAmbito')
        cdgoDep = document.getElementById('cdgoDep')
        cdgoProv = document.getElementById('cdgoProv')
        cdgoDist = document.getElementById('cdgoDist')
        cdgoLocal = document.getElementById('actas_ubigeo')
    }
    if(q == 'numero') nroBuscar = document.getElementById('nroMesa')
    if(q == 'ubigeo'){
        cdgoAmbito.addEventListener("change", async (event) => {
            limpiar("desdeAmbito")
            if(cdgoAmbito.value !== ""){
                lbl(event.target.value)
                cdgoDep.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoDep.disabled = false
                const departamentos = await OnpeController("dpd", event.target.value)
                departamentos[1].forEach(doc => {
                    let departamento = doc.data()
                    cdgoDep.innerHTML += `
                        <option value="${departamento.idDepartamento}">${departamento.Detalle}</option>
                    `
                })
            }
        })
        cdgoDep.addEventListener("change", async (event) => {
            limpiar("desdeDpto")
            if(cdgoDep.value !== ""){
                cdgoProv.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoProv.disabled = false
                const provincias = await OnpeController("prov", event.target.value)
                provincias[1].forEach(doc => {
                    let provincia = doc.data()
                    cdgoProv.innerHTML += `
                        <option value="${provincia.idProvincia}">${provincia.Detalle}</option>
                    `
                })
            }
        })
        cdgoProv.addEventListener("change", async (event) => {
            limpiar("desdeProv")
            if(cdgoProv.value !== ""){
                cdgoDist.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoDist.disabled = false
                const distritos = await OnpeController("dist", event.target.value)
                distritos[1].forEach(doc => {
                    let distrito = doc.data()
                    cdgoDist.innerHTML += `
                        <option value="${distrito.idDistrito}">${distrito.Detalle}</option>
                    `
                })
            }
        })
        cdgoDist.addEventListener("change", async (event) => {
            limpiar("desdeDist")
            if(cdgoDist.value !== ""){
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoLocal.disabled = false
                const locales = await OnpeController("localvotacion", event.target.value)
                locales[1].forEach(doc => {
                    let local = doc.data()
                    cdgoLocal.innerHTML += `
                        <option value="${local.idLocalVotacion}">${local.RazonSocial}</option>
                    `
                })
            }
        })
        cdgoLocal.addEventListener("change", async (event) => {
            limpiar("desdeLocal");
            const idLocal = event.target.value;

            if (idLocal !== "") {
                const res = await OnpeController("grupovotacion", idLocal);
                const listaGrupos = res[1].docs;
                let contador = 0;
                let filasHtml = "";
                let celdasAcumuladas = "";

                listaGrupos.forEach((doc, index) => {
                    const grupo = doc.data();
                    celdasAcumuladas += `
                        <td bgcolor="#C1C1C1" style="cursor:pointer; text-align:center; border:1px solid #fff">
                            <a href="#" id="grupovotacion">
                                ${grupo.idGrupoVotacion}
                            </a>
                        </td>`;
                    if ((index + 1) % 10 === 0 || index === listaGrupos.length - 1) {
                        filasHtml += `<tr>${celdasAcumuladas}</tr>`;
                        celdasAcumuladas = "";
                    }
                });

                // Una sola inyección al DOM (Más rápido)
                html.innerHTML = `
                    <div class="col-xs-12 pbot30">
                        <p class="subtitle">LISTADO DE MESAS</p>
                        <div id="page-wrap1">
                            <table class="table17" cellspacing="0" width="100%">
                                <tbody>
                                    ${filasHtml}
                                </tbody>
                            </table>
                        </div>
                        </div>

                        <div class="col-xs-12 cont-recto oculto-leyenda-color-fondo-mesas">
                        <div class="col-md-4"><img src="images/procesacon.jpg"> Procesada con imagen</div>
                        <div class="col-md-4"><img src="images/procesasin.jpg"> Procesada sin imagen</div>
                        <div class="col-md-4"><img src="images/sinprocesa.jpg"> Sin procesar</div>
                        </div>
        
                        <div class="row pbot30">
                        <div class="col-lg-8 centered">
                            <div class="col-xs-12 col-md-12 col-lg-12">
                            <table>
                                <tbody>
                                <tr>
                                    <td colspan="10">
                                    <div class="conte-paginador">
                                        <span class="paginador-txt">Total de mesas: ${contador}</span>
                                    </div>
                                    </td>
                                </tr>  
                                <tr>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="10">Página: 
                                    <ul class="pagination">
                                        <li class="active"><a class="paginador-n1">1</a></li>
                                    </ul>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                        </div>`;
                        html.hidden = false;
                    grupoV = document.getElementById("grupovotacion");
                    if(grupoV) console.log("existe")
            }
        });
    }
    html.addEventListener("click", async (event) => {
        let enlace = ''
        if(q == 'ubigeo') enlace = event.target.closest("a[id='grupovotacion']");
        if (q == 'numero') enlace = event.target.closest("button[id='btnBuscar']");

        if (enlace) {
            if(q == 'ubigeo') limpiar("desdeGrupo")
            event.preventDefault();
            console.log("hola")
            const valor = q == 'ubigeo' ? enlace.textContent.trim() : nroBuscar.value;
            if(!valor){
                alert("Debe ingresar un numero de Mesa: 000000") 
                return
            }
            let actadetalle = ''
            const actas = await OnpeController("actas", valor);
            const acta_detalle = actas[1];
            if(!acta_detalle.docs[0]){
                actadetalle += `
                    <div class="contenido-resultados">
                        <p>&nbsp;</p>
                        <div class="row">
                            <div class="tab-info">EL NÚMERO DE MESA QUE HA INGRESADO NO EXISTE</div>
                        </div>
                    </div>
                `
                actaHtml.innerHTML = actadetalle;
                return
            }
            const detalle = acta_detalle.docs[0].data();
            const estado = detalle.idEstadoActa == "1" ? "Acta Electoral Normal" : "Acta Electoral Resuelta"
            
            actadetalle += `
                <div class="contenido-resultados">
                    <button class="btn btn-primary pull-right" id="btn-regresar" type="button">
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        REGRESAR
                    </button>
                    <p>&nbsp;</p>
    
                    <div class="row">
                        <div class="tab-info">
                        <div class="tab-content">
                            <div id="detMesa">
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane active" id="presidencial">
                                <div class="tab-info-desc">
                                    
                                    <div class="row">

                                    <div class="col-xs-3 col-md-4">
                                        <div class="mesap01">
                                        <img src="images/mp-sin.jpg" class="img-responsive">
                                        Si requiere la imagen del acta, solicítela a través del procedimiento de acceso a la información pública.
                                        </div>
                                    </div>
                                    <div class="col-xs-9 col-md-8">
                                        <div class="row">
                                        
                                        <div class="col-xs-12">
                                            <p class="subtitle1">ACTA ELECTORAL</p>
                                            <div id="page-wrap">
                                            <table class="table13" cellspacing="0">
                                                <thead>
                                                <tr>
                                                    <th>Mesa N°</th>
                                                    <th>N° Copia</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>${detalle.idGrupoVotacion}</td>
                                                    <td>${detalle.nCopia}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                            
                                        <div class="col-xs-12">
                                            <p class="subtitle1">INFORMACIÓN UBIGEO</p>
                                            <div id="page-wrap">
                                            <table class="table14" cellspacing="0">
                                                <tbody>
                                                <tr class="titulo_tabla">
                                                    <td>Departamento</td>
                                                    <td>Provincia</td>
                                                    <td>Distrito</td>
                                                    <td>Local de votación</td>
                                                    <td>Dirección</td>
                                                </tr>
                                                <tr>
                                                    <td>${detalle.Departamento}</td>
                                                    <td>${detalle.Provincia}</td>
                                                    <td>${detalle.Distrito}</td>
                                                    <td>${detalle.RazonSocial}</td>
                                                    <td>${detalle.Direccion}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                            
                                        <div class="col-xs-12">
                                            <p class="subtitle1">INFORMACIÓN MESA</p>
                                            <div id="page-wrap">
                                            <table class="table15" cellspacing="0">
                                                <tbody>
                                                <tr class="titulo_tabla">
                                                    <td>Electores hábiles</td>
                                                    <td>Total votantes</td>
                                                    <td>Estado del acta</td>
                                                </tr>
                                                <tr>
                                                    <td>${detalle.ElectoresHabiles}</td>
                                                    <td>${detalle.TotalVotantes}</td>
                                                    <td>${estado} </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>

                                        </div>
                                    </div>
                                    </div>
                            
                                    <div>
                                    <div class="col-xs-12 pbot30_acta">
                                        <p class="subtitle1">LISTA DE RESOLUCIONES</p>
                                        <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> No hay resoluciones para el acta seleccionada
                                        <div id="page-wrap">
                                        <div class="col-md-12 resolu"></div>
                                        </div>
                                        <!-- <p class="centro"># : El valor consignado en el acta presenta ilegibilidad.</p> -->
                                    </div>
                                    </div>
                            
                                    <div>
                                    <div class="col-xs-12">
                                        <p class="subtitle1">INFORMACIÓN DEL ACTA ELECTORAL</p>
                                        <div id="page-wrap" class="cont-tabla1">
                                        <table class="table06">
                                            <tbody>
                                            <tr class="titulo_tabla">
                                                <td colspan="2">Organización política</td>
                                                <td>Total de Votos</td>
                                            </tr>
                                                <td>PERUANOS POR EL KAMBIO</td>
                                                <td><img width="40px" height="40px" src="images/simbolo_pkk.jpg"></td>
                                                <td>${detalle.P1}</td>
                                            </tr>
                                            <tr>
                                                <td>FUERZA POPULAR</td>
                                                <td><img width="40px" height="40px" src="images/simbolo_keyko.jpg"></td>
                                                <td>${detalle.P2}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">VOTOS EN BLANCO</td>
                                                <td>${detalle.VotosBlancos}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">VOTOS NULOS</td>
                                                <td>${detalle.VotosNulos}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">VOTOS IMPUGNADOS</td>
                                                <td>${detalle.VotosImpugnados}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">TOTAL DE  VOTOS EMITIDOS</td>
                                                <td>${detalle.TotalVotantes}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                    </div>
                            
                                </div>
                                </div>
                            </div>				
                            
                            </div>
                        </div>
                        </div>
                    </div>
                        
                    </div>
            `
            actaHtml.innerHTML = actadetalle;
            const regresar = document.getElementById("btn-regresar");
            if(q=='ubigeo') {
                html.hidden = true;
                regresar.addEventListener("click", ()=>{
                    actaHtml.innerHTML = '';
                    html.hidden = false;
                })
            }
            if(q == 'numero') regresar.remove()
        }
    });

    const limpiar = (accion) => {
        switch(accion){
            case "desdeAmbito":
                cdgoDep.disabled = true
                cdgoProv.disabled = true
                cdgoDist.disabled = true
                cdgoLocal.disabled = true
                cdgoProv.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoDist.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoDep.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`;
                actaHtml.innerHTML = '';
                html.innerHTML = ''; break;
            case "desdeDpto":
                cdgoProv.disabled = true
                cdgoDist.disabled = true
                cdgoLocal.disabled = true
                cdgoProv.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoDist.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                html.innerHTML = '';
                actaHtml.innerHTML = '';
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`; break;
            case "desdeProv":
                cdgoDist.disabled = true
                cdgoLocal.disabled = true
                cdgoDist.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                html.innerHTML = '';
                actaHtml.innerHTML = '';
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`; break;
            case "desdeDist":
                cdgoLocal.disabled = true
                html.innerHTML = '';
                actaHtml.innerHTML = '';
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`; break;
            case "desdeLocal":
                actaHtml.innerHTML = '';
                html.innerHTML = ''; break;
            case "desdeGrupo":
                actaHtml.innerHTML = ''; break;
        }
    }

    const lbl = (id) => {
        const lblDep = document.getElementById("lblDepartamento")
        const lblProv = document.getElementById("lblProvincia")
        const lblDist = document.getElementById("lblDistrito")
        if(id == "1"){
            lblDep.innerHTML = "Departamento:"
            lblProv.innerHTML = "Provincia:"
            lblDist.innerHTML = "Distrito:"
        }
        else{
            lblDep.innerHTML = "Continente:"
            lblProv.innerHTML = "Pais:"
            lblDist.innerHTML = "Ciudad:"
        }
    }
    if(q == 'ubigeo'){
        cdgoAmbito.dispatchEvent(new Event('change'))
    }
}
var fs = require("fs");
const puppeteer = require('puppeteer');
const lista = "A46103834 B5062918 A28003119 A28015865 A80298839 A15075062 A15075062 A28049161 A28425270 A82018474 A86171964 A95758389 A36602837 A08001851 A47000518 A95758371 A82489451 A85850394 A79380465 A82009812 B62661558 B86670643 B65843864 B64274137 B98399892 B06617815 B01507243 A46103834 A28047223 A81948077 A28017895 B46066361 A60195278 A28238988 B88351036 B18610741".split(" ");
(async () => {
    let url = "https://www.infoempresas.pro/";
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 1200 });
    await page.goto(url, {
        waitUntil: "networkidle2",
    });

    var data = [];
    var notFoundList = [];
    for (const codigo of lista) {
        await page.click(`#busqueda`, {delay: 100});
        await page.keyboard.type(codigo, {delay: 100});
        await page.click(`[type="submit"]`, {delay: 100});
        await page.waitForSelector(`h2`);
        notFound = await page.evaluate(() => {
            if (document.querySelectorAll("h2").length == 1) {
                return true;
            } else return false;
        });
        if (notFound) {
            notFoundList.push(codigo);
        } else {
            await page.waitForSelector(`.mitad .encapsulador h3`);
            dataUno = await page.evaluate(() => {
                datos = {};
                tabla = document.querySelectorAll(`.mitad .encapsulador h3`);
                for (const titulo of tabla) {
                    if (titulo.parentElement.parentElement.parentElement.id.split("-")[0] == "informacion") {
                        key = titulo.textContent.trim();
                        val = titulo.nextElementSibling.textContent.split("\n")[0].trim();
                        datos[key] = val;
                    }
                }
                return datos;
            });
            data.push(dataUno);
        }
    }
    await browser.close();
    fs.writeFile("datosEmpresas.json", JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log("Archivo guardado.");
    });
    console.log("NO ENCONTRADOS:");
    console.log(notFoundList);
})();
<<<<<<< HEAD
use hyper::Server;
use hyper::{Request, Response};
use hyper::service::service_fn;
use std::convert::Infallible;
use hyper::service::make_service_fn;
use hyper::Body;
use std::net::SocketAddr;
async fn hello_world(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
    Ok(Response::new("Hello, World".into()))
}
#[tokio::main]
async fn main() {
    // We'll bind to 127.0.0.1:3000
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    // A `Service` is needed for every connection, so this
    // creates one from our `hello_world` function.
    let make_svc = make_service_fn(|_conn| async {
        // service_fn converts our function into a `Service`
        Ok::<_, Infallible>(service_fn(hello_world))
    });

    let server = Server::bind(&addr).serve(make_svc);

    // Run this server for... forever!
    if let Err(e) = server.await {
        eprintln!("server error: {}", e);
    }
}
=======
/*
    This Source Code Form is subject to the terms of the GNU General Public License:
    Copyright (C) 2021-2022 OPENBOTLIST CONTRUBUTORS 
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
     
    You should have received a copy of the GNU General Public License
    along with this program. If not, see https://www.gnu.org/licenses/.
*/
fn main() {
    println!("this is the backend of the website,still in develoment! looking for rust devs to help us make it real!!!!");
}
>>>>>>> 2d9a4aa17e5914224968f944a5673a664290e643

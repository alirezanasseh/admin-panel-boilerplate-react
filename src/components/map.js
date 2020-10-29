import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps";

export default function Map(props) {
    const MapComponent = withScriptjs(withGoogleMap(props =>
        <GoogleMap
            defaultZoom={13}
            defaultCenter={props.center}
            onClick={e => props.click(e)}
        >
            {props.isMarkerShown && <Marker position={props.marker} />}
            {props.circle && <Circle
                center={props.marker}
                radius={parseInt(props.circle.radius)}
                options={{
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    strokeColor: "blue",
                    strokeWeight: "1"
                }}
            />}
        </GoogleMap>
    ));

    return <MapComponent
        isMarkerShown
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_TOKEN}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        center={props.center}
        marker={props.marker}
        click={props.click}
        circle={props.circle}
    />;
}

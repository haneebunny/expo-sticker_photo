

// export default function Map() {

//     const script = document.createElement("script");
//     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_KEY}&autoload=false&libraries=services`;
//     document.head.appendChild(script);

//     script.onload = () => {
//         window.kakao.maps.load(function () {
//             const container = document.getElementById("map");
//             const options = {
//                 center: new window.kakao.maps.LatLng(33.450701, 126.570667),
//                 level: 3,
//             };

//             return (
//                 <div>
//                     <div id="map" style="width:500px;height:400px;"></div>
//                     Map</div>
//             )
//         }

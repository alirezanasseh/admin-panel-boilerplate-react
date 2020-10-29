import React from "react";
import LightBox from "react-image-lightbox";
import 'react-image-lightbox/style.css';

export default function ShowImages(props) {
    let {imageShow, setImageShow} = props.props;
    return <>
        {imageShow.image && imageShow.image.show && (
            <LightBox
                mainSrc={imageShow.image.src}
                onCloseRequest={
                    () => setImageShow(imageShow.changeBatch({
                        image: imageShow.image.changeBatch({
                            src: '',
                            show: false
                        })
                    }))
                }
            />
        )}
        {imageShow.images && imageShow.images.show && (
            <LightBox
                mainSrc={imageShow.images.src[imageShow.images.photo_index]}
                nextSrc={imageShow.images.src[(imageShow.images.photo_index + 1) % imageShow.images.src.length]}
                prevSrc={imageShow.images.src[(imageShow.images.photo_index + imageShow.images.src.length - 1) % imageShow.images.src.length]}
                onCloseRequest={() =>
                    setImageShow(imageShow.changeBatch({
                        images: imageShow.images.changeBatch({
                            show: false
                        })
                    }))
                }
                onMovePrevRequest={() =>
                    setImageShow(imageShow.changeBatch({
                        images: imageShow.images.changeBatch({
                            photo_index: (imageShow.images.photo_index + imageShow.images.src.length - 1) % imageShow.images.src.length
                        })
                    }))
                }
                onMoveNextRequest={() =>
                    setImageShow(imageShow.images.changeBatch({
                        images: imageShow.images.changeBatch({
                            photo_index: (imageShow.images.photo_index + 1) % imageShow.images.src.length
                        })
                    }))
                }
            />
        )}
    </>;
}
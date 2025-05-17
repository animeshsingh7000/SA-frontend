export default function Spinner() {
    return (
        <div className="full-loader-container full-loader-container-zindex">
            <div className="loader-content">
                <div className="spinner-box">
                    <div className="circle-border">
                        <div className="circle-core"></div>
                    </div>  
                </div>
            </div>
        </div>
    );
}
"use client";

import { useEffect } from 'react';

const FormEmbedDemo = () => {
    const templateId = "85671596-7fda-45dc-9d50-bbb4e3158f97"
    const id = "qMwNBIclbV"

    useEffect(() => {

        const script = document.createElement('script');
        script.src = `https://default.salsalabs.org/api/widget/template/${templateId}/?tId=${id}`;
        script.type = 'text/javascript';

        const container = document.getElementById(id);
        if (container) {
            container.appendChild(script);
        }

        return () => {
            // Cleanup if needed
            if (container && script.parentNode) {
                container.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-16 my-16">
            <div className="w-[700px] mx-auto border border-red-500">
                <div id={id} className="w-full" />
            </div>

            {/* <div className="w-[700px] mx-auto border border-red-500">
                <iframe
                    src="https://returntofreedom.salsalabs.org/leotestform1"
                    className="w-full h-[600px]"
                />
            </div> */}
        </div>
    );
}

export default FormEmbedDemo
import CardLayout from "./public-ui/CardLayout"
import Header from "./public-ui/Header"
import TakeActionLink from "./TakeActionLink"

import TakeActionImage1 from "./images/take-action-1.jpg"
import TakeActionImage2 from "./images/take-action-2.jpg"
import TakeActionImage3 from "./images/take-action-3.jpg"

const TakeActionSection = () => {
    return (
        <div id="take-action" className="w-11/12 mx-auto flex flex-col items-center justify-center gap-8">
            <Header level={1} className="text-cinnamon">
                Take Action
            </Header>

            <CardLayout >
                <TakeActionLink
                    className="mx-auto"
                    title="Sign a petition to end horse slaughter in the United States"
                    image={TakeActionImage1} />
                <TakeActionLink
                    className="mx-auto"
                    title="Contact your representative to ensure this bill does not pass"
                    image={TakeActionImage2} />
                <TakeActionLink
                    className="mx-auto"
                    title="Show your support protesting the BLM's actions"
                    image={TakeActionImage3} />
            </CardLayout>
        </div>
    )
}

export default TakeActionSection
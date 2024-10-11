import Layout from "./Layout.js";
import Table, {Paginator} from "./Table.js";
import "./styles.css";

const init_data = [{"name":"chevrolet chevelle malibu","mpg":18.0,"cylinders":8,"displacement":307.0,"horsepower":130.0,"weight":3504,"acceleration":12.0,"model_year":70,"origin":"usa","id":1},{"name":"buick skylark 320","mpg":15.0,"cylinders":8,"displacement":350.0,"horsepower":165.0,"weight":3693,"acceleration":11.5,"model_year":70,"origin":"usa","id":2},{"name":"plymouth satellite","mpg":18.0,"cylinders":8,"displacement":318.0,"horsepower":150.0,"weight":3436,"acceleration":11.0,"model_year":70,"origin":"usa","id":3},]

export default function Page1(){
    return (
        <>
            <Layout>
                <section>
                    <Table data={init_data} bottomHeader={true} />
                </section>
                <aside>Filter Section</aside>
            </Layout>
            
            <footer>
                <Paginator total={init_data.length} size={25} page_sizes={[10, 25, 50, 100]} page={0} />
            </footer>
        </>
    );
}
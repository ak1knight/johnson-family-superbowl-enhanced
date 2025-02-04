import React, { FormEvent, useContext } from 'react';
import { useRouter } from "next/navigation";
import Card from "./card";
import Scores from './scores';
import Yards from './yards';
import { Question } from "../../data/formdata";
import { FormContext } from '@/data/form-context';
import Image from 'next/image';
import { observer } from 'mobx-react';


// let formData = {};

// teams[2023].forEach(t => {
//     formData[t.name] = { yards: '' }
//     periodNames.forEach(q => {
//         formData[t.name][q] = { score: '' };
//         formData[q] = { tiebreaker: '' }
//     })
// });

type EntryFormProps = {
    year: number,
    questions: Question[],
    isAdmin?: boolean,
    endpoint?: string,
    sectionRefs?: React.RefObject<HTMLDivElement | null>[]
}

const EntryForm = observer(({questions, isAdmin = false, endpoint = "/api/entry/new"}:EntryFormProps) => {
    const router = useRouter();
    const formStore = useContext(FormContext);
    //let [name, setName] = useState(!!entry ? entry.name : '');
    //const [formData, setFormData] = useState(props.entry)

    // React.useEffect(() => {
    //     console.log("boom");
    //     let newFormData = {}
    //     teams[year].forEach(t => {
    //         newFormData[t.name] = { yards: '' }
    //         periodNames.forEach(q => {
    //             newFormData[t.name][q] = { score: '' }
    //         })
    //     });

    //     setFormData({ ...newFormData, ...props.questions })
    //   }, [year]);
    // if (!formData) {
        
    // }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(!isAdmin );
        if (!isAdmin && (formStore.readyToSubmit)) {
            alert('Please respond to all questions before submitting');
            return
        }

        await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({ entry: formStore.entry })
        });

        router.push("/big_board");
    };

    console.log(formStore)

    return <form data-spy="scroll" className='flex flex-col gap-2' data-target="#form-sidebar" data-offset="0" onSubmit={handleSubmit}>
        <Scores />
        <Yards />
        {questions.map((q, i) => <Card key={i} id={`${q.question.toLowerCase().replace(/( |\W)/g, '')}`} title={q.question} extrainfo={q.extrainfo} >
            { !!q.options ? 
                <div className="flex flex-wrap justify-center w-full gap-2 my-2">
                    {q.options.map((option, index) => 
                        <div className="w-[49%]" key={index} >
                            <button type="button" name={option.name} className={`btn btn-block p-3 ${formStore.questionAnswers[i] == option.name ? "btn-primary border-primary" : "btn-light"} h-24 relative border flex justify-center items-center flex-wrap`} onClick={() => formStore.questionAnswers[i] = option.name}>
                                {!!option.image && <div className='h-full w-1/6 relative'><Image alt="option" src={option.image} className="bg-contain" style={{objectFit: 'contain'}} fill /></div>}
                                {!!option.embed && <div className="w-100 mb-2 mt-1"><div className="embed-responsive embed-responsive-16by9"><iframe className="embed-responsive-item" src={option.embed}></iframe></div></div>}
                                <div className="text-center text-lg grow">{option.name + ' - ' + option.score}</div>
                            </button>
                        </div>
                    )}
                </div> :
                <input type="text" value={formStore.questionAnswers[i]} className="input input-bordered w-full bg-base-200 focus:bg-primary focus:text-primary-content" onChange={(e) => formStore.questionAnswers[i] = e.target.value} {...q.config}></input>
            }
        </Card>)}
        <Card title="Enter Name">
            <div className="flex justify-content-between gap-2">
                <div className="grow">
                    <input type="text" value={formStore.name} className="h-full w-full input input-bordered bg-secondary text-xl text-secondary-content" onChange={(e) => formStore.name = e.target.value} />
                </div>
                <div className="col-auto">
                    <input type="submit" className="btn btn-primary btn-lg" value="Submit" />
                </div>
            </div>
        </Card>
    </form>
})

export default EntryForm
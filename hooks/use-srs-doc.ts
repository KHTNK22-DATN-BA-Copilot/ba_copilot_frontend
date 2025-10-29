import useSWR from "swr"

const fetcher = async (url: string, { arg }: { arg: any }) => {
    return fetch(`${window.location.origin}/api${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(arg)
        }).then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok')
            }
            return res.json()
        })
}

export const useSRS = (project_id: string, document_id: string) => {
    const { data, error, isLoading } = useSWR(['/srs-generate/doc', project_id, document_id], 
        ([url, pid, did]) => fetcher(url, { arg: { project_id: pid, document_id: did } })
    );
    return { data, error, isLoading };
}